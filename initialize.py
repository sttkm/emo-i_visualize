import numpy as np
import cv2
from PIL import Image
import sys
import os
import subprocess as sb

def make_fltr1(img_s,thr1,thr2,rr):
    r = (img_s-1)/2
    a,b = np.meshgrid(np.arange(img_s),np.arange(img_s))
    point = np.concatenate((a[:,:,np.newaxis],b[:,:,np.newaxis]),axis=2)
    distance = np.sum((point-r)**2,axis=2)**(1/2)
    fltr = np.ones((img_s,img_s))
    idx = (distance>r*thr1)#*(distance<r*thr2)
    fltr[idx] = 1-(distance[idx]-r*thr1)/(r*thr2-r*thr1)
    fltr[fltr<0] = 0
    fltr = fltr**rr
    return fltr

def make_fltr2(img_s,R,pad,rr):
    R = int(img_s*R)
    pad = int(img_s*pad)
    fltr = np.zeros((img_s,img_s))+pad
    for r in range(1,R+1):
        fltr[r:-r,r:-r] += np.ones((img_s-2*r,img_s-2*r))
    fltr = (fltr/(R+pad))**rr
    return fltr

def cvtHSV(hsv):
    hsv[:,:,1][hsv[:,:,1]>hsv[:,:,2]] = hsv[:,:,2][hsv[:,:,1]>hsv[:,:,2]]
    return hsv

def main():
    EMO = ['smile','laugh','wink','sad','crying','surprised','smug','kiss','heart','fear','scream','ghost']
    emo_s = int(sys.argv[1])
    img_s = int(sys.argv[2])
    fltr_ss = int(img_s/4)
    fltr_lim = int(fltr_ss*0.1)
    fltr = (make_fltr1(img_s,0.65,1.1,0.5)*make_fltr2(img_s,0.25,0.00,0.3))**1.7
    fltr_krnl = np.ones((fltr_ss-2*fltr_lim,fltr_ss-2*fltr_lim))
    fltr_img = np.zeros((emo_s,emo_s))+0.01
    np.save('data/fltr.npy',fltr)
    np.save('data/fltr_krnl.npy',fltr_krnl)
    for emo in EMO:
        dir = 'data/'+emo+'/'
        if not(os.path.exists(dir)):
            os.mkdir(dir)
            os.mkdir(dir+'face/')
            # sb.call(['cp','data/emoji/'+emo+'.png',dir+'emo.png'])
        emo_img = np.array(Image.open('data/emoji/'+emo+'.png'))
        emo_img_s = emo_img.shape[0]
        expansion = 1.1
        emo_img3 = cv2.imread('data/emoji/'+emo+'.png')
        a,b = np.meshgrid(np.arange(emo_img_s),np.arange(emo_img_s))
        c = np.concatenate((a[:,:,np.newaxis],b[:,:,np.newaxis]),axis=2)
        idx = np.sqrt(np.sum((c-emo_img_s/2)**2,axis=2))>(0.95*emo_img_s/2)
        idx *= np.all(emo_img3==255,axis=2)
        emo_img[idx,:3] = [0,0,0]
        while expansion*emo_img_s<emo_s:
            emo_img_s = int(expansion*emo_img_s)
            emo_img = cv2.resize(emo_img,(emo_img_s,emo_img_s),cv2.INTER_LINEAR)
        emo_img = cv2.resize(emo_img,(emo_s,emo_s),cv2.INTER_LINEAR)
        emo_img_hsv = cv2.cvtColor(emo_img[:,:,:3],cv2.COLOR_RGB2HSV).astype(float)
        emo_img_hsv = cvtHSV(emo_img_hsv)
        np.save(dir+'emo_hsv.npy',emo_img_hsv)
        np.save(dir+'fltr_img.npy',fltr_img)
        mosaic_hsv = emo_img_hsv.copy()
        np.save(dir+'out_hsv.npy',mosaic_hsv)
        mosaic = Image.fromarray(np.uint8(emo_img))
        mosaic.save('data/out/'+emo+'.png')
    return

if __name__=='__main__':
    main()
