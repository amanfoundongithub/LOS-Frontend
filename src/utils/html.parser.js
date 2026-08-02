export const isValidHtml = (htmlString, isDebug = false) => {
    try {
        if (isDebug) {
            console.log("Starting HTML parser...")
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        return !doc.querySelector('parsererror');
    } catch (e) {
        if (isDebug) {
            console.log("Parser failed due to the reason", e);
        }
        return false;
    }
}

export const formatHtml = (htmlString) => {
    if (!isValidHtml(htmlString)) {
        return "";
    }
    let formatted = '';
    let indent = 0;
    const indentString = '  ';
    htmlString = htmlString.replace(/>\s+</g, '><');
    let i = 0;
    while (i < htmlString.length) {
        if (htmlString[i] === '<') {
            let endTag = htmlString.indexOf('>', i);
            let tag = htmlString.substring(i, endTag + 1);
            if (tag.startsWith('</')) {
                indent = Math.max(0, indent - 1);
                formatted += indentString.repeat(indent) + tag + '\n';
            } else if (tag.endsWith('/>')) {
                formatted += indentString.repeat(indent) + tag + '\n';
            } else if (tag.startsWith('<!') || tag.startsWith('<?')) {
                formatted += tag + '\n';
            } else {
                formatted += indentString.repeat(indent) + tag + '\n';
                indent++;
            }
            i = endTag + 1;
        } else {
            let nextTag = htmlString.indexOf('<', i);
            if (nextTag === -1){
                nextTag = htmlString.length;
            }
            let text = htmlString.substring(i, nextTag).trim();
            if (text) {
                formatted += indentString.repeat(indent) + text + '\n';
            }
            i = nextTag;
        }
    }
    return formatted;
}