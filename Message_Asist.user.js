// ==UserScript==
// @name        Message Asist
// @namespace        http://tampermonkey.net/
// @version        0.8
// @description        メッセージ送信確認画面のチェック補助
// @author        Ameba Blog User
// @match        https://msg.ameba.jp/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameba.jp
// @grant        none
// @updateURL        https://github.com/personwritep/Message_Asist/raw/main/Message_Asist.user.js
// @downloadURL        https://github.com/personwritep/Message_Asist/raw/main/Message_Asist.user.js
// ==/UserScript==



let pathname=location.pathname;


/* 受信箱　受信メッセージリストの場合 */
if(document.querySelector('#sort')){
    let set_word; // ストレージ登録データ
    let read_json=localStorage.getItem('MessageAsist_set'); // ローカルストレージ保存名
    set_word=JSON.parse(read_json);
    if(set_word==null){
        set_word=''; }


    let sw=
        '<input type="checkbox" id="sender_reg" name="matches">'+
        '<svg class="sender_reg" aria-hidden="true" viewBox="0 0 24 24">'+
        '<path d="M9.93 18.66c-.56 0-1.12-.19-1.58-.57l-4.8-3.93c-.64-.52-.74-1'+
        '.47-.21-2.11.53-.64 1.47-.73 2.11-.21l4.45 3.64 9.04-9.04a1.49 1.49 0 0 1 '+
        '2.12 0c.58.59.59 1.54 0 2.12l-9.36 9.36c-.49.49-1.12.74-1.77.74z">'+
        '</path></svg>'+
        '<label id="set_box_sw" for="matches" title="検索語設定ボックスを開く">検索</label>'+
        '<svg id="message_asist_help" viewBox="0 0 150 150">'+
        '<path d="M66 13C56 15 47 18 39 24C-12 60 18 146 82 137C92 135 '+
        '102 131 110 126C162 90 128 4 66 13M68 25C131 17 145 117 81 125C16 '+
        '133 3 34 68 25M69 40C61 41 39 58 58 61C66 63 73 47 82 57C84 60 '+
        '83 62 81 65C77 70 52 90 76 89C82 89 82 84 86 81C92 76 98 74 100 66'+
        'C105 48 84 37 69 40M70 94C58 99 66 118 78 112C90 107 82 89 70 94z">'+
        '</path></svg>'+
        '<style>'+
        'svg.sender_reg { width: 18px; height: 10px; fill: #fff; } '+
        '#set_box_sw { cursor: pointer; } '+
        '#message_asist_help { height: 16px; margin: 0 0 -3px 6px; fill: #2196f3; '+
        'cursor: pointer; } '+
        '#iconList { left: 415px !important; } '+
        '.senderCell:hover { position: absolute; z-index: 1; width: auto; padding-right: 40px; '+
        'padding-top: 11.2px; background: #fff; }</style>';

    let sw_box=document.querySelector('#allSelect');
    if(sw_box){
        if(!document.querySelector('#sender_reg')){
            sw_box.insertAdjacentHTML('beforeend', sw); }}


    let help=document.querySelector('#message_asist_help');
    if(help){
        help.onclick=function(){
            let url='https://ameblo.jp/personwritep/entry-12841108285.html';
            window.open(url, '_blank'); }}


    let checkboxAll=document.querySelector('#checkboxAll');
    let sender_reg=document.querySelector('#sender_reg');
    if(checkboxAll && sender_reg){
        sender_reg.onclick=function(event){
            checkboxAll.checked=false;
            if(sender_reg.checked==true){
                check_do(1); }
            else{
                check_do(0); }}

        checkboxAll.onmouseup=function(){
            sender_reg.checked=false; }}


    function check_do(n){
        let d_word=[]; // 検索語の配列
        d_word=set_word.split(/\x20/);
        let reg_text=d_word.join('|');
        let regexp=new RegExp(reg_text);

        let tr=document.querySelectorAll('.tableList tr');
        let count=0;
        for(let k=1; k<tr.length; k++){
            if(n==1){
                let table_sw=tr[k].querySelector('.tableList-checkbox');
                if(table_sw){
                    let sender=tr[k].querySelector('.senderCell').textContent;
                    if(set_word!='' && regexp.test(sender)){
                        count+=1;
                        table_sw.checked=true; }
                    else{
                        table_sw.checked=false; }}}
            else{
                let table_sw=tr[k].querySelector('.tableList-checkbox');
                if(table_sw){
                    table_sw.checked=false; }
                count=0; }}

        if(count==0){
            able(0); }
        else{
            able(1); }}


    function able(n){
        let btnDelete=document.querySelector('.sbmtOnImg .btnDelete');
        if(btnDelete){
            if(n==0){
                btnDelete.disabled=true; }
            else{
                btnDelete.disabled=false; }}}


    check_set();

    function check_set(){
        let set_box_sw=document.querySelector('#set_box_sw');
        set_box_sw.onclick=function(){
            let clean_box=
                '<div id="clean_box">'+
                '<input id="word_set" type="text"> '+
                '<input id="clean_set" type="button" value="Set">　'+
                '<input id="close" type="button" value="✖">'+
                '</div>'+
                '<style>'+
                '#clean_box { position: fixed; top: 40px; left: calc(50% - 240px); '+
                'font: normal 16px Meiryo; padding: 20px; background: #fff; '+
                'border: 1px solid #aaa; box-shadow: 10px 20px 50px rgb(0 0 0 / 25%); } '+
                '#clean_box input { font-family: inherit; font-size: 100%; } '+
                '#word_set { width: 300px; padding: 4px 6px 2px; } '+
                '#clean_set, #close { padding: 4px 4px 2px; }'+
                '</style>';

            if(!document.querySelector('#clean_box')){
                document.body.insertAdjacentHTML('beforeend', clean_box); }
            else{
                document.querySelector('#clean_box').remove(); }


            let word_set=document.querySelector('#clean_box #word_set');
            let clean_set=document.querySelector('#clean_box #clean_set');
            let close=document.querySelector('#clean_box #close');
            if(word_set){
                word_set.value=set_word; // 初期値を表示
                word_set.addEventListener('change', function(){
                    let input_word=word_set.value;
                    clean_set.onclick=function(){
                        let tmp_word=input_word.split(/[\x20\u3000]/);
                        tmp_word.forEach((val)=>{
                            val=val.replace(/\s/g, ''); }) // 配列全要素から再度 空白文字を削除
                        tmp_word=tmp_word.filter(Boolean); // 空要素を削除
                        word_set.value=tmp_word.join(' ');
                        set_word=word_set.value;
                        let write_json=JSON.stringify(set_word);
                        localStorage.setItem('MessageAsist_set', write_json); // ローカルストレージ保存
                    }});

                close.onclick=function(){
                    document.querySelector('#clean_box').remove(); }
            }}
    } // check_set()

} // 受信箱　受信メッセージリストの場合




/* 受信箱ウインドウの場合 */
if(pathname.includes('ucs/received/detail')){

    let search=location.search;

    /* 受信箱のメッセージ表示画面 */
    if(!search.endsWith('&')){

        let css=
            '<style id="MA">'+
            'td#dupe { width: 799px; '+
            'display: block; box-sizing: border-box; position: absolute; top: 0; '+
            'padding: 10px 20px; line-height: 1.7; overflow-y: scroll; visibility: hidden; }'+
            '#msgReport { position: absolute; bottom: 64px; right: 0; }'+
            '#msgReport::before { content: "□ Shift+Click：等幅サブウインドウ表示"; '+
            'position: relative; top: -20px; left: 228px; }'+
            '.sbmtOnImg { position: relative; }'+
            '</style>';

        if(!document.querySelector('#MA')){
            document.body.insertAdjacentHTML('afterbegin', css); } // スタイルを追加



        let reply=document.querySelector('.sbmtOnImg input[value="返信する"]');
        if(reply){

            let newwin_h; // サブウインドウの高さ 310～810
            let textarea=document.querySelector('#detlMain');
            let new_url='/ucs/received/detail'+ search+'&';

            if(textarea){
                let dupe=textarea.cloneNode(true);
                dupe.id='dupe';
                textarea.parentNode.appendChild(dupe);

                reply.onmousedown=function(e){
                    if(e.shiftKey){
                        dupe.style.width='799px';
                        let h_pos=dupe.getBoundingClientRect().height;
                        if(h_pos<200){
                            newwin_h=310; }
                        else{
                            if(h_pos<700){
                                newwin_h=h_pos + 110; }
                            else{
                                newwin_h=810; }}
                        let newwin=open(
                            new_url, '_blank', 'width=799, height='+ newwin_h +', left=10,top=80'); }
                    else{
                        dupe.style.width='600px';
                        let h_pos=dupe.getBoundingClientRect().height;
                        if(h_pos<200){
                            newwin_h=310; }
                        else{
                            if(h_pos<700){
                                newwin_h=h_pos + 110; }
                            else{
                                newwin_h=810; }}
                        let newwin=open(
                            new_url, '_blank', 'width=600, height='+ newwin_h +', left=10,top=80'); }}

            }}} // 受信箱のメッセージ表示画面




    /* 元メッセージを表示するサブウインドウ */
    if(search.endsWith('&')){
        let css=
            '<style id="MA">'+
            'html, body { background: #fff !important; overflow: hidden !important; }'+
            '#ucsContent { margin: 0; width: 100% !important; border: none; }'+
            '#ucsContent:before, #ucsContent:after { display: none; }'+
            '#ucsMainLeft { margin: 0 !important; width: 100% !important; }'+
            '.messageTable { margin: 0; border-bottom: 15px solid #00aaffd6 !important; }'+
            'form .messageTable th:first-child { display: none; }'+
            'form .messageTable tr:nth-child(2) { width: 100% !important; }'+
            '#detlMain { width: 100% !important; height: calc(100vh - 105px) !important; '+
            'resize: unset !important; }'+
            '#globalHeader, #ucsHeader, #ucsMenu, #ucsMainLeft h1, #localNav, #msgActn, '+
            '#ucsMainRight, #msgReport, .sbmtOnImg, .attentionB { display: none; }'+
            '</style>';

        if(!document.querySelector('#MA')){
            document.body.insertAdjacentHTML('afterbegin', css); }} // スタイルを追加

} // 受信箱ウインドウの場合




/* 返信メッセージ編集画面 */
if(pathname.includes('ucs/reply/index')){
    let textarea=document.querySelector('#aEditorTextarea');
    if(textarea){
        textarea.value=''; }}




/* 管理画面で返信メッセージを確認 */
if(pathname.includes('ucs/reply/confirm')){

    let detlMain=document.querySelector('#detlMain');
    let uM_raw=document.querySelector('#ucsMainLeft input[name="messageBody"]');

    if(detlMain && uM_raw){

        let child_nodes=detlMain.childNodes;
        for(let k=child_nodes.length-1; k>=0; k--){ // 末尾まで連続するBRタグを削除
            if(child_nodes[k].tagName=="BR"){
                child_nodes[k].remove(); }
            else{
                break; }}

        uM_raw.value=detlMain.innerText; // 実際の送信内容を更新


        let end_p='<p class="end_p" style="color: #2196f3">◀▶</p>';
        if(!detlMain.querySelector('.end_p')){
            detlMain.insertAdjacentHTML('beforeend', end_p); } // 末尾マークを表示

        detlMain.scrollTo(0, detlMain.scrollHeight); } // メッセージ末尾をスクロール表示


    let sbmtOnImg=document.querySelector('.sbmtOnImg');
    if(sbmtOnImg){
        let disp=
            '<span style="position: absolute; left: 0; font: bold 16px Meiryo; '+
            'padding: 4px 15px 2px; border-radius: 5px; color: #fff; background: #f00; '+
            'margin-left: 15px;">Check Message</span>';

        if(!sbmtOnImg.querySelector('span')){
            sbmtOnImg.insertAdjacentHTML('afterbegin', disp); }} // 動作の表示を追加

} // ucs/reply/confirm 管理画面で返信メッセージを確認




/* 相手ページでメッセージを書く場合 */
if(pathname.includes('pub/send/confirm')){

    let messagePreview=document.querySelector('#messagePreview dd>div');
    let cc_raw=document.querySelector('#confcontainer input[name="messageBody"]');

    if(messagePreview && cc_raw){

        let child_nodes=messagePreview.childNodes;
        for(let k=child_nodes.length-1; k>=0; k--){ // 末尾まで連続するBRタグを削除
            if(child_nodes[k].tagName=="BR"){
                child_nodes[k].remove(); }
            else{
                break; }}

        cc_raw.value=messagePreview.innerText; // 実際の送信内容を更新


        let end_p='<p class="end_p" style="color: #2196f3">◀▶</p>';
        if(!messagePreview.querySelector('.end_p')){
            messagePreview.insertAdjacentHTML('beforeend', end_p); } // 末尾マークを表示

        setTimeout(()=>{
            let message_scroll=document.querySelector('#messagePreview dd');
            if(message_scroll){
                message_scroll.scrollTo(0, message_scroll.scrollHeight); } // メッセージ末尾をスクロール表示
        }, 1000); }



    let confbtntwo=document.querySelector('#confbtntwo');
    if(confbtntwo){
        let disp=
            '<span style="position: absolute; left: 20px; font: bold 16px Meiryo; '+
            'padding: 4px 15px 2px; border-radius: 5px; color: #fff; background: #f00; '+
            'margin-left: 15px;">Check Message</span>';

        if(!confbtntwo.querySelector('span')){
            confbtntwo.insertAdjacentHTML('afterbegin', disp); }} // 動作の表示を追加

} // pub/send/confirm  相手ページでメッセージを書く場合

