document.getElementById('generateButton').addEventListener('click', function() {
    var email = document.getElementById('emailInput').value.replace(/@gmail\.com$/i, "");
    var useDotTrick = document.getElementById('dotTrickToggle').checked;
    var usePlusTrick = document.getElementById('plusTrickToggle').checked;
    var numVariations = parseInt(document.getElementById('numVariations').value) || 512;

    if (!email) {
        alert("Please enter a Gmail username.");
        return;
    }

    var results = generateGmailVariations(email, useDotTrick, usePlusTrick, numVariations);
    displayResults(results);
});

document.getElementById('saveButton').addEventListener('click', function() {
    var email = document.getElementById('emailInput').value.trim();
    var content = document.getElementById('result').value;

    if (!email) {
        alert('Please enter your Gmail username.');
        return;
    }

    if (!content) {
        alert('Please generate emails first.');
        return;
    }

    // Appending '@gmail.com' if not present
    if (!email.endsWith('@gmail.com')) {
        email += '@gmail.com';
    }

    var filename = email + ' generated emails.txt';

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
});



function generateGmailVariations(email, useDotTrick, usePlusTrick, numVariations) {
    var variations = useDotTrick ? generateDotVariations(email) : [email];

    if (usePlusTrick) {
        variations = variations.flatMap(v => generatePlusVariations(v, numVariations / variations.length));
    }

    return variations.map(emailVar => emailVar + '@gmail.com').slice(0, numVariations);
}

function generateDotVariations(email) {
    var variations = [email];
    var maxDotVariations = Math.pow(2, email.length - 1);

    for (var i = 1; i < maxDotVariations; i++) {
        var bin = (i).toString(2).padStart(email.length - 1, '0');
        var newEmail = '';
        var previousCharWasDot = false;

        for (var j = 0; j < bin.length; j++) {
            newEmail += email[j];
            if (bin[j] === '1' && !previousCharWasDot) {
                newEmail += '.';
                previousCharWasDot = true;
            } else {
                previousCharWasDot = false;
            }
        }
        newEmail += email[email.length - 1];
        variations.push(newEmail);
    }

    return variations.filter(email => !/\.\./.test(email)); // Filter out emails with consecutive dots
}


function generatePlusVariations(baseEmail, count) {
    var variations = [];
    for (var i = 0; i < count; i++) {
        variations.push(baseEmail + '+' + generateRandomName());
    }
    return variations;
}

function displayResults(emails) {
    document.getElementById('result').value = emails.join('\n');
}

function downloadToFile(content, filename, contentType) {
    var a = document.createElement('a');
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function generateRandomName() {
    const names = ["alice", "bob", "charlie", "dave", "eve", "frank", "grace", "heidi", "ivan", "judy"];
    return names[Math.floor(Math.random() * names.length)];
}
