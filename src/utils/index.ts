import he from 'he';
// encode(decode) html text into html entity
export const decodeHtmlEntity = (str: string) => he.decode(str);
export const stripHtmlTags = (str: string) => {
    const div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || div.innerText || '';
};

export const encodeHtmlEntity = (str: string) => he.encode(str);

//   var entity = '&#39640;&#32423;&#31243;&#24207;&#35774;&#35745;';
//   var str = '高级程序设计';

//   let element = document.getElementById("testFunct");
//   element.innerHTML = (decodeHtmlEntity(entity));

//   console.log(decodeHtmlEntity(entity) === str);
//   console.log(encodeHtmlEntity(str) === entity);
// output:
// true
// true
