import requests
from PIL import Image
import numpy as np
import sys
import os

url = 'https://api-us.faceplusplus.com/facepp/v3/detect'
api_key = 'VG68gkAPdFGHdDjupTkAJvezGnTmXUtz'
api_secret = 'qHdI54VpUSJZIuHKLXxNLot8Za-OjeF1'
param = {'api_key':api_key,'api_secret':api_secret}

def main():
    img_s = int(sys.argv[1])
    path = sys.argv[2]
    emo = sys.argv[3]
    name = sys.argv[4]
    file = path+emo+'_'+name
    if not(os.path.exists(file)):
        print('not exists')
        quit()
    # file = 'data/face_raw/'+emo+'_'+name
    img_data = {'image_file':(file,open(file,'rb').read(),'image/jpeg')}
    r = requests.post(url,params=param,files=img_data).json()
    img = Image.open(file)
    size = img.size
    [x,y,w,h] = [0,0,size[0],size[1]]
    if 'faces' in r.keys():
        r = r['faces']
        p = []
        q = []
        for k in range(len(r)):
            r_ = r[k]['face_rectangle']
            p.append([r_['top'],r_['left'],r_['width'],r_['height']])
            q.append(p[-1][2]*p[-1][3])
        [x,y,w,h] = p[np.argmax(q)]
    img = img.crop((y,x,y+h,x+w))
    img = img.resize((img_s, img_s), Image.LANCZOS)
    # os.remove(file)
    img.save('data/'+emo+'/face/'+name)
    # img.save('/'.join(path.split('/')[:-2])+'/face/'+emo+'/'+name)
    print('crop done.')

if __name__=='__main__':
    main()
