const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('website shares navigation and workbench boots the approved dimensions',()=>{
  const home=fs.readFileSync('index.html','utf8'),work=fs.readFileSync('badge-dimensions.html','utf8');
  assert.match(home,/project.css/);assert.match(home,/badge-dimensions.html/);assert.match(home,/02-ribbon.png/);assert.match(home,/05-mosaic.png/);
  assert.match(work,/approved-dimensions.js/);assert.match(work,/BadgeApprovedSpec/);assert.match(work,/loadApproved/);
});
test('rebuilding preserves the historical archive boundary',()=>{
  require('node:child_process').execFileSync(process.execPath,['scripts/build-project.mjs']);
  const archive=fs.readFileSync('design-archive.html','utf8');
  assert.doesNotMatch(archive,/data-image="(?:specs|designs|assets|output)\//);
});
