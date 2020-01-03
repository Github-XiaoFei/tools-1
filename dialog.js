var num = document.querySelectorAll('li[data-test-id="chat"] a>div>span')[0].innerText;
var body = document.querySelector('body');
var myAudio = new Audio("https://freesound.org/data/previews/24/24929_37876-lq.mp3");
myAudio.loop = true;
setInterval(function () {
    let numN = document.querySelectorAll('li[data-test-id="chat"] a>div>span')[0]
        .innerText;
    if (numN > num) {
        myAudio.play();
        document.querySelector('body').insertAdjacentHTML('afterbegin', html);
    }
    num = document.querySelectorAll('li[data-test-id="chat"] a>div>span')[0].innerText;
}, 10000)

function stop() {
    myAudio.pause();
    document.querySelector('#box-dialog').style.display = 'none';
}

var html = `
<style>
#box{opacity:.5;z-index:1071;position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:#000}#dialog{position:fixed;top:5%;left:35%;width:400px;height:200px;pointer-events:none;max-width:500px;margin:1.75rem auto;transform:none;z-index:1080}#dialog .modal-content{position:relative;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;width:100%;pointer-events:auto;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.2);border-radius:.3rem;outline:0}#dialog .modal-header{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start;-ms-flex-pack:justify;justify-content:space-between;padding:1rem 1rem;border-bottom:1px solid #e9ecef;border-top-left-radius:.3rem;border-top-right-radius:.3rem}#dialog h5{margin-bottom:0;line-height:1.5;font-size:1.25rem;font-family:inherit;margin-top:0}#dialog .modal-body{position:relative;-ms-flex:1 1 auto;flex:1 1 auto;padding:1rem}#dialog .modal-body p{margin-top:0;margin-bottom:1rem}#dialog .modal-footer{display:flex;align-items:center;justify-content:flex-end;padding:1rem;border-top:1px solid #e9ecef;border-bottom-right-radius:.3rem;border-bottom-left-radius:.3rem}#dialog .btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}#dialog .btn{display:inline-block;font-weight:400;color:#212529;text-align:center;vertical-align:middle;user-select:none;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}#dialog .btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}#dialog .btn-primary:hover{background-color:#0a5cb3}#dialog .btn{cursor:pointer}
</style>
<div id='box-dialog'>
<div id='box-dialog'><div id="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">提示</h5> <button type="button" class="close" onclick="stop()"> <span aria-hidden="true">&times;</span> </button></div><div class="modal-body"><p>🔔👋有新用户加入</p></div><div class="modal-footer"> <button type="button" onclick="stop()" class="btn btn-primary" data-dismiss="modal">我知道了</button></div></div></div></div><div id="box"></div></div>
`;
