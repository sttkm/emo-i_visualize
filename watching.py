from __future__ import print_function
import sys
import time
import subprocess
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

class MyHandler(PatternMatchingEventHandler):
    def __init__(self,emo_s,img_s,path,command,patterns):
        super(MyHandler, self).__init__(patterns=patterns)
        self.command = command
        self.file = ''
        self.emo_s = emo_s
        self.img_s = img_s
        self.path = path

    def _run_command(self):
        splt = self.file.split('/')[-1].split('_')
        subprocess.call(['sh',self.command,self.emo_s,self.img_s,self.path,splt[0],splt[1]])

    # def on_moved(self, event):
    #     self._run_command()

    def on_created(self,event):
        self.file = event.src_path
        print('created.')
        self._run_command()

    # def on_deleted(self, event):
    #     self._run_command()

    # def on_modified(self, event):
    #     self._run_command()


def watch(emo_s,img_s,path):
    subprocess.call(['python','initialize.py',emo_s,img_s])
    print('initialized.')
    event_handler = MyHandler(emo_s,img_s,path,'./do.sh', ["*.jpg"])
    observer = Observer()
    observer.schedule(event_handler,path,recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(5)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == "__main__":
    if 2 > len(sys.argv):
        print("Usage:", sys.argv[0], "dir_to_watch")
    else:
        watch(sys.argv[1],sys.argv[2],sys.argv[3])
