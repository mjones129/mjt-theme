const figlet = require('figlet');
const prompt = require('prompt-sync') ();
const fs = require('fs');

console.log(
    figlet.textSync("ThemeGen", {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true,
    })
);

let themeTags = '';
let themeVersion = '0.0.1';


const themeName = prompt("What's the name of your theme? ");
console.log("That's an awesome name. Good thinking!");
const authorName = prompt("What's the author's name? ");
console.log(`Nice to meet you, ${authorName}!`);
const authorURI = prompt(`Do you have a website, ${authorName}? `);
console.log("Awesome, I'll be sure to include that.");
const themeDesc = prompt("How would you describe this theme? ");
console.log("Very nice!");
const themeTagCheck = prompt("Would you like to add any tags to your theme? (y/n) ");

if (themeTagCheck == "y") {
    let themeTags = prompt('Please enter your theme tags: ');
}


const versionCheck = prompt("I assume this is version 0.0.1? (y/n) ");

if (versionCheck == "y") {
    let themeVersion = "0.0.1";
} if (versionCheck == "n") {
    let themeVersion = prompt("Please enter version number: ");
}

//remove spaces from theme name to create text domain
const textDomainCondensed = themeName.split(" ").join("");
//set the text domain to all lowercase
const textDomain = textDomainCondensed.toLowerCase();

console.log(`Congrats, ${authorName}! Your theme has been generated!`);

let stylesheetData =   `/*
Theme Name: ${themeName}
Theme URI: https://wordpress.org/themes/twentytwenty/
Author: ${authorName}
Author URI: ${authorURI}
Description: ${themeDesc}
Tags: ${themeTags}
Version: ${themeVersion}
Requires at least: 6.3.1
Tested up to: 6.3.1
Requires PHP: 8.2
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: ${textDomain}
This theme, like WordPress, is licensed under the GPL.
Use it to make something cool, have fun, and share what you've learned with others.
*/`


fs.writeFile('style.css', stylesheetData, (err) => {
    if(err) throw err;
});