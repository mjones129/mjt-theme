<?php
//Add stylesheet
function add_style() {
  //custom styles
  wp_enqueue_style('blocks-styles', get_stylesheet_uri());
  //particles
  wp_enqueue_script('particle-instance', get_template_directory_uri() . '/js/particles.js', [], '1.0.0', []);
  wp_enqueue_script('pjs', get_template_directory_uri() . '/node_modules/particlesjs/dist/particles.min.js', [], '2.0.0', []);
  //anime js
  // wp_enqueue_script('anime-core', get_template_directory_uri() . '/node_modules/animejs/lib/anime.min.js', [], null, []);
  // wp_enqueue_script('anime-config', get_template_directory_uri(). '/js/cards.js', [], null, []);
  //bootstrap
  wp_enqueue_style('bootstrap-css', get_template_directory_uri() . '/node_modules/bootstrap/dist/css/bootstrap.min.css');
  wp_enqueue_script('bootstrap-js', get_template_directory_uri() . '/node_modules/bootstrap/dist/js/bootstrap.min.js', [], null, []);
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
