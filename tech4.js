
      document.getElementById("button").onclick = function(){
        //クリックしてスタート
          //facebook-jsonを取得して表示
              let count = 0;
              const limit = 50; //表示件数
              const graph_api = 'https://graph.facebook.com/ig_hashtag_search?';
              const accessToken = 'EAAnGQ8kLkaUBAGFZBOS9ZBMPQWgZBvd5SdUppEXiHTW0GbrBP7xkSdU4bV4y7zVoDblKy8GMDBwSw1tZA9WMfaYZCwvIsnYZBwAi7s7PmbZCD9pCARGQhb8YlaQZAmnthpnzu4sMEEqZCtK2vV1zafoIWjcEgEOlJqZA1qMswJ85162aS9iVbSwCpF'; // アクセストークン
              const businessID = '17841441477914224'; //グラフAPIエクスプローラで取得したinstagram_business_accountのID
          
              let text = '';
              let hashtag = [];
              let input_message = [];
              input_message = document.getElementById("input_message").value;//テキストボックス内のキーワードを格納
              // console.log(input_message[5]);
              hashtag = input_message.split(/\s+/);
              
              console.log(hashtag);
              console.log(hashtag.length);
              
              
              const results = [];
              
              const filteredResult = [];
              for(let j=0;j< hashtag.length;j++){
                
                var url = graph_api + "user_id=" + businessID + "&q="+ hashtag[j] +"&access_token=" + accessToken;
          
              
                //タグID検索
                let request = new XMLHttpRequest();
                    request.open('GET', url, false);
                    request.send(null);
                let url3;
          
                  if (request.readyState === 4 && request.status === 200){//リクエストの成功判定
                    let data = request.responseText;
                     //console.log(data);//JSONデータの表示
                    let getid = JSON.parse(data);//JSONを連想配列にする
                    console.log(getid.data[0].id);//連想配列内のオブジェクトからIDまで行く
                    const url1= 'https://graph.facebook.com/'
                    const url2 = '/recent_media?user_id='+businessID+'&fields=media_url,permalink&limit='+limit+'&access_token='+accessToken;
                    url3 = url1 + getid.data[0].id + url2;
                    //console.log(url3);//投稿検索URLの表示
                    }
                    
                //タグIDから投稿IDを検索する
                let request2 = new XMLHttpRequest();
                    request2.open('GET', url3, false);
                    request2.send(null);
          
                // let getid2 ;
          
                if (request2.status == 200){
                    let data2 = request2.responseText;
                    console.log(data2);
                    let getid2 = JSON.parse(data2);
                    results.push(getid2.data);//JSONデータをひとつの配列に格納
                    console.log(results);
  
                  }
                  }
                  //id比較
                  // ハッシュタグ複数の場合
                  let NewResult = [];
                  if(hashtag.length > 1){

                    for(let i=0;i<limit;i++){
                        filteredResult[i] = results[0][i];
                    }
            
                    let flag = 0;
                    for(let cnt=0;cnt<limit;cnt++){
                      for(let i=0;i<hashtag.length-1;i++){
                        for(let j=0;j<limit;j++){
                          // console.log(results);
                          // console.log(i+1);
                          // console.log(results[i+1]);
                          if(filteredResult[cnt].id == results[i+1][j].id){
                            flag = 1;
                          }
                        }
                      }
                      if(flag == 1){
                        NewResult.push(filteredResult[cnt]);
                      }
                      flag = 0;
                    }
                    //console.log(NewResult);
                  
                  console.log(NewResult);
                  //表示
                    for(let i=0; i<NewResult.length;i++) {
                      console.log(i);
                      text1 = '<li><a href="'+NewResult[i].permalink+'" target="_blank">';
                      text2 = '<img src="'+NewResult[i].media_url+'">';
                      text3 = '</a></li>';
                      text = text + text1 + text2 + text3;
                      //console.log(NewResult[i]);
                    console.log(NewResult[i].permalink);
                      
                    }
                  }
                  //ハッシュタグひとつの場合
                  else{
                    for(let i=0;i<limit;i++){
                      NewResult.push(results[0][i]);
                    }
                  
                      
                      
                      console.log(NewResult);
                      //表示
                        for(let i=0; i<limit;i++) {
                          console.log(i);
                          text1 = '<li><a href="'+NewResult[i].permalink+'" target="_blank">';
                          text2 = '<img src="'+NewResult[i].media_url+'">';
                          text3 = '</a></li>';
                          text = text + text1 + text2 + text3;
                          
                          
                        }
                    }
                    
                  
                  

                  
                  
                    console.log(text);
                    $('#instagram-list').html(text);
          
          
          
                
            }
            
            
      