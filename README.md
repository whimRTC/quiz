# wh.im app template
# 早押しクイズゲーム

## 概要
wh.im上でアプリを動かすときのVue.jsによるテンプレートです。
wh.im上で遊べる 早押しクイズゲームのソースコードです。
自由に使っていただいてかまいません。
(魔改造して、whimに登録しても大丈夫ですw)

## 使い方
クローンし、remoteを変更します
## gitのクローン
``` 
git clone git@github.com:sally-inc/whim-template.git {app_name}
cd {app_name}
git remote set-url origin {your_url}
git clone git@github.com:whimRTC/quiz.git
```

## 起動
``` 
yarn
yarn serve
``` 

## 起動(Docker)
```
docker build --tag app:latest . 
docker run -it -v $PWD:/app -p 3001:3001 app:latest
```

## ドキュメント・質問
実装を見てわからないところがあれば、ドキュメントを確認してみてください！
- https://docs.wh.im/developer
またわからないところがあれば、質問も大歓迎です！
- https://groups.google.com/forum/?hl=ja#!forum/whim-developer