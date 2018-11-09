# emo-i_visualize
====

## Overview
制作展 emo-i visualization
メインシステムで取得した，人物写真（表情）と裏の表情を受け取り，可視化する．  
使用した絵文字に対し，裏の感情の人物写真が透ける．

## Files
__initialize.py__   : visualizeする画像の初期化など．
```
  python initilize.py 'output image size' 'face image size'
```

__face_crop.py__    : 人物写真の顔部分をface++によってクロップ & リサイズ．
```
  python face_crop.py 'face image size' 'public directory path' 'emotion type' 'file number'
```

__mk_mosaic.py__    : 絵文字に顔を合成，保存．
```
  python mk_mosaic.py 'output image size' 'face image size' 'emotion type' 'file number'
```

__watching.py__     : 共有フォルダを監視．初期に _initialize.py_ を実行．人物画像が追加される度 _face_crop.py，mk_mosaic.py_ を実行．
```
  python watching.py 'output image size' 'face image size' 'public directory path'
```

__do.sh__           : _watching.py_ で呼び出される． _face_crop.py，mk_mosaic.py_ を実行．
```
  sh do.sh 'output image size' 'face image size' 'public directory path' 'emotion type' 'file number'
```

__electron-redus/__ : electronフレームワークでWebGLを使用してvisualize．合成画像が更新される度に更新．
```
  electron electron-redus/
```

__data/__           : _絵文字.png_ など．合成のための中間ファイル等．

## Required
### python module
numpy, scipy, cv2, PIL, requests, watchdog, time, subprocess, os .
### java script
sorry, forgot.

## Usage
```
  python watching.py 1024 300 'public directory path'
```
if _' initialized '_ output, execution next command on other thread.
```
  electron electron-redus/
```

## Algorithm of mixing face and emoji
後に追加
