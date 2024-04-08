// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

function main() {
  const fillers = {
    adventurer: ["adventurer", "traveller"],
    pre: ["Fra", "Tro", "Gre", "Hor"],
    post: ["gria", "ston", "gott", "kin", "dar"],
    item_adj: ["fire", "water", "light", "arcane"],
    item: ["axe", "staff", "book", "cloak", "sword", "boots"],
    num: [
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "ten",
      "eleven",
      "twelve",
    ],
    looty: ["copper", "silver", "gold"],
    loots: ["coins", "chalices", "ingots"],
    baddies: ["orcs", "glubs", "fishmen", "goblins", "ogres", "wolves"],
    place: ["town", "city", "outskirts", "village"],
  };
  
  const template = `The $place of $pre$post is under attack by $num $baddies!

  Rewards: $num $looty $loots, $item_adj $item
  
  
  `;

  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
  
}

// let's get this party started - uncomment me
main();