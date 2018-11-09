# emo-i_visualize
====

## Overview
制作展 emo-i visualization
メインシステムで取得した，人物写真（表情）と裏の表情を受け取り，可視化する．
使用した絵文字に対し，裏の感情の人物写真が透ける．

## Files
initialize.py   : visualizeする画像の初期化など．
```
  python initilize.py 'output image size' 'face image size'
```

face_crop.py    : 人物写真の顔部分をface++によってクロップ & リサイズ．
```
  python face_crop.py 'face image size' 'public directory path' 'emotion type' 'file number'
```

mk_mosaic.py    : 絵文字に顔を合成，保存．
```
  python mk_mosaic.py 'output image size' 'face image size' 'emotion type' 'file number'
```

watching.py     : 共有フォルダを監視．初期にinitialize.pyを実行．人物画像が追加される度ace_crop.py，mk_mosaic.pyを実行．
```
  python watching.py 'output image size' 'face image size' 'public directory path'
```

do.sh           : watching.pyで呼び出される．face_crop.py，mk_mosaic.pyを実行．
```
  sh do.sh 'output image size' 'face image size' 'public directory path' 'emotion type' 'file number'
```

electron-redus/ : electronフレームワークでWebGLを使用してvisualize．合成画像が更新される度に更新．
```
  electron electron-redus/
```

data/           : 絵文字.pngなど．合成のための中間ファイル等．

## Required
### python module
numpy, scipy, cv2, PIL, requests, watchdog, time, subprocess, os
### java script
sorry, forgot.

## Usage
```
  python watching.py 1024 300 'public directory path'
```
if 'initialized' output, execution next command on other thread.
```
  electron electron-redus/
```

## Algorithm of mixing face and emoji
後に追加
