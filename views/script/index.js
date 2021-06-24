const fs = require('fs');


const editMde = new SimpleMDE({
    element: document.getElementById('editor'),
    spellChecker: false,
    initialValue: '## Stuff.... ',
    hideIcons: ['guide', 'fullscreen', 'side-by-side']
    // guide implmentation is open to you
    // fullscreen and sxs muss up layout
});
editMde.value('# Sample Markdown\n- one\n- two\n- three');