from glob import glob
import requests
import numpy as np
import cv2
from scipy import signal
import sys

S_rate = 0.4
V_rate = 0.6
face_decay = 0.94

def cvtHSV(hsv):
    hsv[:,:,1][hsv[:,:,1]>hsv[:,:,2]] = hsv[:,:,2][hsv[:,:,1]>hsv[:,:,2]]
    return hsv

def main():
    emo_s = int(sys.argv[1])
    img_s = int(sys.argv[2])
    emo = sys.argv[3]
    file = sys.argv[4]
    dir = 'data/'+emo
    mosaic_hsv = np.load(dir+'/out_hsv.npy')
    emo_hsv = np.load(dir+'/emo_hsv.npy')
    fltr = np.load('data/fltr.npy')
    fltr_img = np.load(dir+'/fltr_img.npy')
    fltr_krnl = np.load('data/fltr_krnl.npy')

    emo_file = dir+'/face/'+file
    img = np.array(cv2.imread(emo_file))

    fltr_ss = int(img_s/4)
    fltr_lim = int(fltr_ss*0.1)

    fltr_img_ = cv2.resize(np.uint8(fltr_img*255),(int(emo_s/4),int(emo_s/4)),cv2.INTER_LINEAR)/255
    fltr_map = signal.convolve2d(fltr_img_,fltr_krnl,'valid')
    fltr_map = (1.00001-fltr_map/np.max(fltr_map))**3
    ss = fltr_map.shape[0]
    z = np.random.choice(ss**2,p=(fltr_map/np.sum(fltr_map)).flatten())

    start = ((np.array([int(z/ss),z%ss]) +np.random.rand(2)-0.5 -fltr_lim)*img_s/fltr_ss -1).astype(int)
    end = start+img_s
    end[end>emo_s-1] = emo_s
    avoid = np.zeros((2,2)).astype(int)
    avoid[0,start<0] = -start[start<0]
    avoid[1,:] = end-start
    start += avoid[0,:]
    fltr_ = fltr[avoid[0,0]:avoid[1,0],avoid[0,1]:avoid[1,1]]

    img_hsv = cv2.cvtColor(img[avoid[0,0]:avoid[1,0],avoid[0,1]:avoid[1,1]],cv2.COLOR_BGR2HSV).astype(float)
    img_hsv = cvtHSV(img_hsv)
    img_hsv[:,:,1] *= (S_rate*fltr_)
    img_hsv[:,:,2] *= (V_rate*fltr_)
    mos_hsv = mosaic_hsv[start[0]:end[0], start[1]:end[1],:]
    mos_hsv[:,:,1] *= (1-S_rate*fltr_)
    mos_hsv[:,:,2] *= (1-V_rate*fltr_)
    hsv = mos_hsv+img_hsv
    mosaic_hsv[start[0]:end[0], start[1]:end[1],1:] = hsv[:,:,1:]
    fltr_img[start[0]:end[0],start[1]:end[1]] += fltr_
    fltr_img[start[0]:end[0],start[1]:end[1]] = fltr_img[start[0]:end[0],start[1]:end[1]]**0.7
    fltr_img /= np.max(fltr_img)
    mosaic = cv2.cvtColor(np.uint8(mosaic_hsv),cv2.COLOR_HSV2BGR)
    mosaic_hsv = mosaic_hsv*face_decay + emo_hsv*(1-face_decay)

    np.save(dir+'/fltr_img.npy',fltr_img)
    np.save(dir+'/out_hsv.npy',mosaic_hsv)
    cv2.imwrite('data/out/'+emo+'.png',mosaic)
    print('make mosaic done.')

if __name__=='__main__':
    main()
