/**
 * This will get image name from official wiki to match image inside API
 * to decide which slot it's in
 * This is the first part of the process
 * Data are from http://wiki.wargaming.net/en/Ship:Upgrades
 */

let slot = {};

let wiki = document.getElementsByClassName('wikitable');
for (let table of wiki) {
  let id = parseInt(table.id.split('_')[0].slice(-1));
  if (!slot[id]) slot[id] = [];
	for (let u of table.childNodes[1].childNodes) {
    if (u.nodeName === '#text') continue;
    
    let node = u.childNodes[1];
    if (node.nodeName !== 'TD') continue;

    let img = node.childNodes[1];
    if (img.nodeName === "#text") img = node.childNodes[0];
    let name = img.alt.toLowerCase();
    let final = name.split('_').filter(t => t !== 'wows').join('_');

    slot[id].push(final);
		console.log(id, final);
	}
}

let json = JSON.stringify(slot);

/**
 * This is the second part
 * You need to get all upgrades from WarGaming API by yourself
 */
data = json.data;
// Parse json here
for (let a in data) {
	let slot = data[a].image.toLowerCase();
	for (let i = 1; i <= 6; i++) {
    for (let b in image[i]) {
      if (slot.includes(image[i][b])) {
        data[a]['slot'] = i + 1;
      }
    }
  }
}

for (let a in data) {
	delete data[a].consumable_id;
 	delete data[a].image;
}