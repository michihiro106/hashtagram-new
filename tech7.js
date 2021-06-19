document.getElementById("button").onclick = function () {  //クリックしてスタート

    //初期値設定
    const limit = 50; //表示件数
    const graph_api = 'https://graph.facebook.com/ig_hashtag_search?';
    const accessToken = 'EAAnGQ8kLkaUBAJZBwSNPRzYxDmdRdhNIbs9rcSxAPiXEdQCDCWPhwtVakusBKgSQ0i9jYusooYr0F4MRrfqYQXIgQLx8fbNpdLZBNUdCNP5IaZBaDvKQbjld0A6Ii1w7Guc5NjQ6YdNi7IQBNyYpyCyEEZBvB138AF0fP9SPoA2BUEg39R3v'; // アクセストークン
                         
    const businessID = '17841441477914224'; //グラフAPIエクスプローラで取得したinstagram_business_accountのID
    let text = ''; //表示処理の際利用
    let hashtag = [];
    let input_message = [];
    let dataMedias = {};
    let dataId;
    input_message = document.getElementById("input_message").value; //テキストボックス内のキーワードを格納
    hashtag = input_message.split(/\s+/);
    console.log(hashtag);
    //console.log(hashtag.length);

    //メイン処理
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
                                        if (dataMedias[t].length < 90) {
                                            myasync(after);
                                        }else{
                                            console.log(dataMedias);
                                            console.log(t);
                                            // let key = t;

                                            //dataMedias[t]中の任意の値を取り出す
                                            console.log(JSON.stringify(Object.values(dataMedias[t])[10].id));

                                            //console.log(Object.values(dataMedias[t])[0]);　　
                                            //console.log(Object.values(dataMedias[t]));　
                                            //console.log(JSON.stringify(dataMedias[t]));　 
                                        }
                                        return;
                                    })
                            }
                            myasync(after);
                        })
                })
        })
    }


    //開始位置
    if (hashtag.length < 5) {
        Promise.all(hashtag.map(function (tag) {
            return new Promise(resolve => {
                return func1(tag)
                    .then(result => {
                        resolve(result);
                    });
            });
        }));
        
    }else{
        console.log("五つ以下のタグを入力してください");
    }
            
}