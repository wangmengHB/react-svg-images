const performance = require("perf_hooks").performance;
const { dirInit, writeIconModule, buildLib, writeEntryPoints } = require("./task");


async function main() {
  try {
    const start = performance.now();
    console.log(`================= build start =================`);
    await dirInit();
    await writeIconModule();
    await buildLib();
    await writeEntryPoints();

    const end = performance.now();
    console.log(`build success end: `, Math.floor(end - start) / 1000, "sec\n\n");


  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
