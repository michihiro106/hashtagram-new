
document.getElementById("button").onclick = function () {

    //クリックしてスタート
    //facebook-jsonを取得して表示
    let count = 0;
    const limit = 50; //表示件数
    const graph_api = 'https://graph.facebook.com/ig_hashtag_search?';
    const accessToken = 'EAAnGQ8kLkaUBAA7uwcktBemDqtU819jSBOkvozeWqzAlGorGFTu1HEKJK2xnnTFJSEXDEcZCUn6xpjMc41HNYohEusQ3uMLyBZBhZANhE8Gk2JrTBzwPiOkwpHsZCJZC4OZBoLaDJBTxFz5aqKSZC2ZAUIuVvhZBI4VakZAOQsyVgSnX7pZBfhsUpZBo168dtdpSHocZD'; 
    const businessID = "17841441477914224"; //グラフAPIエクスプローラで取得したinstagram_business_accountのID
    let text = '';
    let hashtag = [];
    let input_message = [];
    input_message = document.getElementById("input_message").value; //テキストボックス内のキーワードを格納
    // console.log(input_message[5]);
    hashtag = input_message.split(/\s+/);
    console.log(hashtag);
    console.log(hashtag.length);
    // console.log(hashtag[0]);


    //promise.allを使って投稿検索を非同期処理する必要！
    // 非同期処理の定義


    var dataMedias = {};
    function func1(t) {
        console.log(t);

        return new Promise(function (resolve, reject) {

            const url0 = graph_api + "user_id=" + businessID + "&q=" + t + "&access_token=" + accessToken;
            var dataId;
            var dataMedia;
            //タグID検索
            fetch(url0)
                .then((response) => {
                    return response.json() //ここでBodyからJSONを返す

                })
                .then((result) => {
                    dataId = result;

                    const url1 = 'https://graph.facebook.com/'
                    const url2 = '/recent_media?user_id=' + businessID + '&fields=media_url,permalink&limit=' + limit + '&access_token=' + accessToken;
                    const url3 = url1 + dataId.data[0].id + url2;

                    //console.log(url3);

                    fetch(url3)
                        .then((response) => {
                            return response.json()
                        })

                        .then((result) => {
                            console.log(t + "first");
                            //console.log(result);
                            dataMedias[t] = result;

                            //func2(dataMedia);
                            // for (let i = 0; i < 10; i++) {
                            //     text1 = '<li><a href="' + dataMedia.data[i].permalink + '" target="_blank">';
                            //     text2 = '<img src="' + dataMedia.data[i].media_url + '">';
                            //     text3 = '</a></li>';
                            //     text = text + text1 + text2 + text3;
                            // }

                            // $('#instagram-list').html(text);


                            //after
                            let after = dataMedias[t].paging.cursors.after;                            

                            async function myasync(after2) {
                                // console.log('myasync');
                                const url4 = url1 + dataId.data[0].id + '/recent_media?user_id=' + businessID + '&fields=media_url,permalink&limit=' + limit + '&after=' + after2 + '&access_token=' + accessToken;
                                await fetch(url4)
                                    .then((response) => {
                                        return response.json()
                                    })

                                    .then((result) => {
                                        console.log(t + "after")
                                        //console.log(result);
                                        const sampleReslt = {
                                            "福島":[
                                                {},{},{}
                                            ],
                                            "温泉":[
                                                {},{},{}
                                            ]
                                        };
                                        const oldResult = [
                                            [{},{},{}],
                                            [{},{},{}]
                                        ];
                                        dataMedia2 = result;
                                        Array.prototype.push.apply(dataMedias[t].data, result.data);
                                        console.log(dataMedias[t]);

                                        after = dataMedia2.paging.cursors.after;
                                        // //  console.log(after);
                                        // url4 = url1 + dataId.data[0].id + '/recent_media?user_id=' + businessID + '&fields=media_url,permalink&limit=' + limit + '&after=' + after + '&access_token=' + accessToken;
                                        // for (let i = 0; i < 50; i++) {
                                        //     // console.log(i);
                                        //     text1 = '<li><a href="' + dataMedia2.data[i].permalink + '" target="_blank">';
                                        //     text2 = '<img src="' + dataMedia2.data[i].media_url + '">';
                                        //     text3 = '</a></li>';
                                        //     text = text + text1 + text2 + text3;
                                        // }

                                        $('#instagram-list').html(text);

                                        if (dataMedias[t].data.length < 200) {
                                            myasync(after);
                                        }
                                        return;
                                    })
                                    .catch((e) => {
                                        console.log(e) //エラーをキャッチし表示     
                                    })
                            }
                            myasync(after);
                        })
                        .catch((e) => {
                            console.log(e) //エラーをキャッチし表示     
                        })
                })
                .catch((e) => {
                    console.log(e) //エラーをキャッチし表示     
                })
        })
    }

    // function func2 (mmm) {
    //     console.log(mmm);
    // }

    if (hashtag.length < 5) {
        Promise.all(hashtag.map(function (tag) {
                // console.log(tag);
                // return func1(tag);
                return new Promise(resolve => {
                    return func1(tag)
                        .then(result => {
                            resolve(result);
                        });
                    // setTimeout(() => {
                    //   console.log(new Date());
                    //   console.log(tag);
                    //   resolve(tag);
                    // },3000)
                })

            }))
            .then((result) => {
                console.log(result);
            })
            .catch((result) => {
                console.log(result);
            });
    }else{
        console.log("五つ以下のタグを入力してください");
    }
}