const editMde = new SimpleMDE({
    element: document.getElementById('editor'),
    spellChecker: false,
    initialValue: '## Stuff.... ',
    hideIcons: ['guide', 'fullscreen', 'side-by-side']
    // guide implmentation is open to you
    // fullscreen and sxs muss up layout
});
editMde.value('# Sample Markdown\n- one\n- two\n- three');

let data = editMde.value();

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
download(data, 'data.txt', 'text/plain');

let dropBtn = document.querySelector('.dropBtn');
dropBtn.addEventListener('click', function () {
    let dropdown = document.querySelector('.dropdown-content');
    if (dropdown.style.display == 'block')
    dropdown.style.display = 'none';
    else
    dropdown.style.display = 'block';
});
