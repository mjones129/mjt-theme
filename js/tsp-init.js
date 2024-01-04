(async () => {
  await loadLinksPreset(tsParticles); // this is required only if you are not using the bundle script

  await tsParticles.load("tsparticles", {
    preset: "links",
  });
})();
