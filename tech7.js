document.getElementById("button").onclick = function () {  //クリックしてスタート

    //初期値設定
    const limit = 50; //表示件数
    const graph_api = 'https://graph.facebook.com/ig_hashtag_search?';
    const accessToken = 'EAAnGQ8kLkaUBAKcXVlJFSYGLPS1Tnx6ZBkLUPW9aGwPn5tHZCKStZB3eW0SliT3KgZAfQe1VKQ6ZBiJXC3jubtErsSdCul8LidamAdkHoKTYuFFjEb00pxqLdy8ZBQoUG3qgONl5QBY2DYy3xZB3mBP5tJYc8spoYxfZCtIX7MVAluZAEBJ8PiCfK8E2ETE72KZCQZD'; // アクセストークン
    const businessID = '17841441477914224'; //グラフAPIエクスプローラで取得したinstagram_business_accountのID
    let text = ''; //表示処理の際利用
    let hashtag = [];
    let input_message = [];
    let dataMedias = {};
    let dataId;
    let filteredResult=[];
    input_message = document.getElementById("input_message").value; //テキストボックス内のキーワードを格納
    hashtag = input_message.split(/\s+/);
    console.log(hashtag);
    //console.log(hashtag.length);
    //console.log(func1());  //func1の属性を見る

    //投稿検索、記録処理
    function func1(t) {
        return new Promise(function (resolve, reject) {
            dataMedias[t]=[];　　//tをキーに配列を作成
            const url0 = graph_api + "user_id=" + businessID + "&q=" + t + "&access_token=" + accessToken;
             //タグID検索
             fetch(url0)
                .then((response) => {
                    return response.json() //ここでBodyからJSONを返す,定型処理
                 })
                .then((result) => {
                    dataId = result; //JSONをdataIdに代入
                    const url1 = 'https://graph.facebook.com/'
                    const url2 = '/recent_media?user_id=' + businessID + '&fields=media_url,permalink&limit=' + limit + '&access_token=' + accessToken;
                    const url3 = url1 + dataId.data[0].id + url2;//投稿検索URLの作成

                    fetch(url3) //投稿検索URLの展開
                        .then((response) => {
                            return response.json()//JSONを返す
                        })
                        .then((result) => {
                            dataMedias[t] = result.data;//配列にデータを格納

                            //after処理
                            let after = result.paging.cursors.after;                            
                            async function myasync(after2) {
                                const url4 = url1 + dataId.data[0].id + '/recent_media?user_id=' + businessID + '&fields=media_url,permalink&limit=' + limit + '&after=' + after2 + '&access_token=' + accessToken;
                                await fetch(url4)
                                    .then((response) => {
                                        return response.json()
                                    })
                                    .then((result) => {
                                        //console.log(t + "after")
                                        dataMedia2 = result.data;
                                        dataMedias[t] = dataMedias[t].concat(result.data);   //afterデータの追加

                                        after = result.paging.cursors.after;  //次のafterの取得
                                        let i = 0;
                                        if (i < 2) {
                                            i++;
                                            myasync(after);
                                        }else{
                                            console.log(dataMedias);
                                            console.log(t);
                                            // let key = t;

                                            //dataMedias[t]中の任意の値を取り出す
                                            console.log(dataMedias[t][0].permalink);
                                            resolve(true);
                                            // console.log(JSON.stringify(Object.values(dataMedias[t])[0].id));
                                        }
                                    })
                            }
                            myasync(after);
                        })
                    // resolve();
                })
        })
    }

    //一致処理
    let func2 = ()=>{

    }


    //開始位置
    if (hashtag.length < 5) {
        Promise.all(hashtag.map(function (tag) {
            return new Promise(resolve => {
                return func1(tag)
                    .then(result => {
                        //ひとつの処理が終わるごと
                        resolve(result);
                    });
            });
        }))　//全ての投稿取得終了
        .then(()=>{ //一致処理へ
            console.log("test2");
            func2();
        });
        
    }else{
        console.log("五つ以下のタグを入力してください");
    }
            
}