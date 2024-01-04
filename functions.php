<?php
//Check GitHub for updates
function automatic_Github_updates($data) {
  //Theme Information
  $theme = get_stylesheet(); //folder name of the current theme
  $current = wp_get_theme()->get('Version'); //Get the version of the current theme

  //Github Information
  $user = 'mjones129'; //Github username hosting the repository
  $repo = 'mjt-theme'; //Repository name as it appears in the URL

  //Get the latest release tag from the repository. The User-Agent header must be sent, as per Github's API documentation: https://developer.github.com/v3/#user-agent-required
  $file = @json_decode(@file_get_contents('https://api.github.com/repos/'.$user.'/'.$repo.'/releases/latest', false, stream_context_create(['http' => ['header' => "User-Agent: ".$user."/r/n"]])
  ));
  if($file) {
    $update = filter_var($file->tag_name, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    //only return a response if there is a new version number higher than the current version
    if($update > $current) {
      $data->response[$theme] = array(
        'theme' => $theme,
        //Strip the version number of any non-alpha characters (excluding the period)
        //That way you can still use tags like v1.1 or ver1.1 if desired
        'new_version' => $update,
        'url' => 'https://github.com/'.$user.'/'.$repo,
        'package' => $file->assets[0]->browser_download_url,
      );
    }
  }
  return $data;
}
add_filter('pre_set_site_transient_update_themes', 'automatic_Github_updates');


//Add stylesheet
function add_style() {
  //particles
  // wp_enqueue_script("tsconfig", get_template_directory_uri() . "/js/particles-config.js", [], null, true);
  wp_enqueue_script("tsparticles", get_template_directory_uri() . "/node_modules/@tsparticles/engine/tsparticles.engine.js", [], null, true);
  wp_enqueue_script("tsbasic", get_template_directory_uri() . "/node_modules/@tsparticles/basic/tsparticles.basic.js", ["tsparticles"], null, true);
  // wp_enqueue_script("linkspreset", "https://cdn.jsdelivr.net/npm/@tsparticles/preset-links@2/tsparticles.preset.links.min.js", ["tsparticles"], "2.0.0", true);
  wp_enqueue_script("linkpreset", "https://cdnjs.cloudflare.com/ajax/libs/tsparticles-preset-links/2.12.0/tsparticles.preset.links.min.js", ["tsparticles"], "2.0.0", true);
  wp_enqueue_script("tspinit", get_template_directory_uri() . "/js/tsp-init.js", ["tsparticles"], null, true);
  //anime js
  // wp_enqueue_script('anime-core', get_template_directory_uri() . '/node_modules/animejs/lib/anime.min.js', [], null, []);
  // wp_enqueue_script('anime-config', get_template_directory_uri(). '/js/cards.js', [], null, []);
  //bootstrap
  wp_enqueue_style('bootstrap-css', get_template_directory_uri() . '/node_modules/bootstrap/dist/css/bootstrap.min.css');
  wp_enqueue_script('bootstrap-js', get_template_directory_uri() . '/node_modules/bootstrap/dist/js/bootstrap.min.js', [], null, []);
  //custom styles
  wp_enqueue_style('blocks-styles', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'add_style');

//add year shortcode
function tg_year() {
  return date("Y");
}
add_shortcode('year', 'tg_year');

//add es module type
function tg_add_module($tag, $handle, $src) {
  //if it's not the anime script, do nothing and return the tag
  if ('anime-core' != $handle || 'anime-config' != $handle) {
    return $tag;
  }
  //change the script tag by adding type="module" and return it.
  $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
  return $tag;
}
add_filter('script_loader_tag', 'tg_add_module', 10, 3);
