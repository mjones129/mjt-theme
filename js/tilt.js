/**
 * allTilt.js
 * Author: Bastian Fießinger
 * Version: 1.0.0
 */

'use strict';
HTMLElement.prototype.allTilt = function(settings) {
  
  if ( typeof(settings) == 'undefined' ) {
    settings = {};
  }
  
  /**
   * @param {number} settings.max - Maximum rotation of tilt object in degrees. Default: 20
   * @param {boolean} settings.inverted - Invert the effect. Default: false
   * @param {number|string} settings.perspective - use 'auto' or a numeric value. Default: 'auto'
   * @param {number} settings.transitionDuration - Duration of transitioneffects on while entering or leaving the tilt box. Default 400
   * @param {string} settings.easing - Easing Function. Default: cubic-bezier(.03,.98,.52,.99)
   * @param {number} settings.scale - Scale the element while hovering. Default: 1
   * @param {boolean} settings.ambientLightning - Add a lightning to the element. Default: true
   * @param {number} settings.maxLightning - maximum opacity of the ambient lightning. Default: 0.5
   * @param {string} settings.axis - might be 'both', 'x' or 'y'. Default: 'both'
   * @param {boolean} settings.content3D.enabled - Automatically add a 3D Effect to inner contents. Default: true
   * @param {string|array} settings.content3D.position - 'auto' will set the inner Element directly centered. Also strings like '50 40' or '50% 40%' as well as 'center left' are allowed. Default 'auto'
   * @param {string|number} settings.content3D.intensity - 'auto' is used to determine the translateZ by making it half the elements larger side. You can use a number instead. Default 'auto'
   */
  const tiltSetup = (settings) => {
    let defaults = {
      max: 20,
      inverted: false,
      perspective: 'auto',
      transitionDuration: 400,
      easing: 'cubic-bezier(.03,.98,.52,.99)',
      scale: 1,
      ambientLightning: true,
      maxLightning: 0.5,
      axis: 'both',
      content3D: {
        enabled: false,
        position: 'auto',
        intensity: 'auto'
      },
    };
    
    // Rebuild Settings
    let settingsObj = {};
    /**
     * @param {string} prop - The actual Property to set.
     * @param {string} innerprop - The Property if it's nested
     * @param {string} aliasProp - The data-name of the Property
     */
    let setOptions = (prop, innerProp, aliasProp) => {
      
      // Setup a new Object if there are nested Properties
      if ( innerProp != null && settingsObj[prop] == null ) {
        settingsObj[prop] = {};
      }
      
      // First Check for Data Attributes on an element
      if ( this.hasAttribute('data-tilt-' + aliasProp) ) {

        let attr = this.getAttribute('data-tilt-' + aliasProp);
        try {
          if ( innerProp == null ) {
            settingsObj[prop] = JSON.parse(attr);
          } else {
            settingsObj[prop][innerProp] = JSON.parse(attr);
          }
        } catch(e) {
          if ( innerProp == null ) {
            settingsObj[prop] = attr;
          } else {
            settingsObj[prop][innerProp] = attr;
          }
        }
        
      // Now Check the original Settings Object
      } else if ( prop in settings ) {
        
        if ( innerProp == null ) {
          settingsObj[prop] = settings[prop];
        } else {
          settingsObj[prop][innerProp] = settings[prop][innerProp];
        }
        
      // At least check for the setting in the Defaults Object
      } else {
        if ( innerProp == null ) {
          settingsObj[prop] = defaults[prop];
        } else {
          settingsObj[prop][innerProp] = defaults[prop][innerProp];
        }
      }
    }
    
    // Finally rebuild the settings Object
    Object.keys(defaults).map(prop => {
      
      if( typeof(defaults[prop]) == 'object' ) {
        Object.keys(defaults[prop]).map(nestedProp => {
          setOptions(prop, nestedProp, prop + '-' + nestedProp);
        });
      } else {
        setOptions(prop, null, prop);
      }
      
    });
    
    return settingsObj;
  }
  
  settings = tiltSetup(settings);

  // Autogenerate Perspective value from base element
  if ( settings.perspective == 'auto' ) {
    settings.perspective = Math.max( this.getBoundingClientRect().width, this.getBoundingClientRect().height ) * 2;
  }
  
  // Set initial Transform String
  const initTransforms = 'perspective(' + settings.perspective + 'px) rotateX(0) rotateY(0)';
  
  // Prepare all Values for usage
  const prepareValues = function(e) {
    
    const elemViewBox = this.getBoundingClientRect(),
          cursorX = e.clientX,
          cursorY = e.clientY,
          elemX = cursorX - elemViewBox.x,
          elemY = cursorY - elemViewBox.y,
          elemW = elemViewBox.width,
          elemH = elemViewBox.height;

    let percX = (Math.round(-elemX/elemW * 100) + 50) * 2,
        percY = (Math.round(-elemY/elemH * 100) + 50) * 2;
    
    // Invert Percentage
    if ( settings.inverted ) {
      percX *= -1;
      percY *= -1;
    }
    
    let ambientAngle = Math.atan2(elemY, elemX)*(360/Math.PI);
    
    const val = {
      clientX: cursorX,
      clientY: cursorY,
      elemX: elemX,
      elemY: elemY,
      elemH: elemH,
      elemW: elemW,
      ambientAngle: ambientAngle,
      ambientOpacity: Math.min(Math.max((percY * settings.maxLightning ) / 100, 0), settings.maxLightning ),
      degX: Math.min(Math.max(percY * ( settings.max / 100 ), settings.max * -1), settings.max),
      degY: Math.min(Math.max(percX * ( settings.max / 100 ), settings.max * -1), settings.max),
    };   
    
    return val;
  };
  
  const initTiltContainer = function(el, firstInstance) {

    const elStyle = el.style;
    elStyle.position = 'relative';
    elStyle.transform = initTransforms;
    elStyle.willChange = 'transform';
    
    const elInitViewBox = el.getBoundingClientRect();
    
    if ( settings.content3D.enabled ) {
      
      el.style.transformStyle = 'preserve-3D';
      
      const content3DSettings = settings.content3D;
      
      const tiltInnerElementBox = el.querySelector('.alltilt-inner-viewbox') || document.createElement('div');
      tiltInnerElementBox.className = 'alltilt-inner-viewbox';
      const tiltInnerElement = tiltInnerElementBox.querySelector('.alltilt-inner') || document.createElement('div');
      tiltInnerElement.className = 'alltilt-inner';
      
      if ( content3DSettings.intensity == 'auto' ) {
        content3DSettings.intensity = Math.min( elInitViewBox.width, elInitViewBox.height ) / 2;
      }
      
      let innerTransformStr = 'translateZ(' + content3DSettings.intensity + 'px)';
      
      let inner3DPos = {
        0: null, // Top Value
        1: null  // Left Value
      };
     
      if ( Array.isArray( content3DSettings.position ) ) {
        inner3DPos[0] = content3DSettings.position[0];
        inner3DPos[1] = content3DSettings.position[1];
      } else if ( content3DSettings.position == 'auto' ) {
        inner3DPos[0] = 50;
        inner3DPos[1] = 50;
      } else {
        const inner3DPosParts = content3DSettings.position.split(' ');
        inner3DPosParts.forEach(function(pos, i) {
          const trailingChar = pos.slice(-1);
          if ( !isNaN(pos) ) {
           inner3DPos[i] = parseInt(pos); 
          } else if (trailingChar == '%') { // check last character is string
            pos = pos.slice(0, -1); // trim last character
            inner3DPos[i] = parseInt(pos);
          } else if ( pos == 'top' || pos == 'left' ) {
            inner3DPos[i] = 0;
          } else if ( pos == 'center' ) {
            inner3DPos[i] = 50;
          } else if ( pos == 'bottom' || pos == 'right' ) {
            inner3DPos[i] = 100;
          }
        });
      }
      
      if ( ( inner3DPos[0] == null || inner3DPos[1] == null ) || ( isNaN(inner3DPos[0]) || isNaN(inner3DPos[1]) ) ) {
        console.warn('The value "' + content3DSettings.position + '" is not allowed for position! You can use integers, "X%", or keywords like "center", "top" or "right" instead. Usage: "valTop valLeft".' );
        inner3DPos[0] = 50;
        inner3DPos[1] = 50;
      }
      
      innerTransformStr += ' translateY(-50%) translateX(-50%)';
      
      const tiltInnerBoxElStyle = tiltInnerElementBox.style;
      tiltInnerBoxElStyle.position = 'relative';
      tiltInnerBoxElStyle.width = elInitViewBox.width + 'px';
      tiltInnerBoxElStyle.height = elInitViewBox.height + 'px';

      // Remove box padding as the element gets absolute positioned
      el.style.padding = 0;

      const tiltInnerElStyle = tiltInnerElement.style;
      tiltInnerElStyle.position = 'absolute';
      tiltInnerElStyle.top = inner3DPos[0] + '%';
      tiltInnerElStyle.left = inner3DPos[1] + '%';      
      tiltInnerElStyle.webkitTransform = innerTransformStr;
      tiltInnerElStyle.MozTransform = innerTransformStr;
      tiltInnerElStyle.msTransform = innerTransformStr;
      tiltInnerElStyle.OTransform = innerTransformStr;
      tiltInnerElStyle.transform = innerTransformStr;
      const elInitChildren = Array.from( el.children );
      
      if ( firstInstance ) {
        el.appendChild(tiltInnerElementBox);
        tiltInnerElementBox.appendChild(tiltInnerElement);
        elInitChildren.forEach(function(node, i) {
          tiltInnerElement.appendChild(node);
        });
      }
      
    }
    
    if ( settings.ambientLightning ) {
      
      const ambientLightningContainer = el.querySelector('.alltilt-ambient-lightning-container') || document.createElement('div');
      ambientLightningContainer.className = 'alltilt-ambient-lightning-container';
      
      const ambientLightningCStyle = ambientLightningContainer.style;
      ambientLightningCStyle.width = elInitViewBox.width + 'px';
      ambientLightningCStyle.height = elInitViewBox.height + 'px';
      ambientLightningCStyle.position = 'absolute';
      ambientLightningCStyle.left = 0;
      ambientLightningCStyle.top = 0;
      ambientLightningCStyle.overflow = 'hidden';
      ambientLightningCStyle.pointerevents = 'none';
      
      el.appendChild(ambientLightningContainer);
      
      const ambientLightning = ambientLightningContainer.querySelector('.alltilt-ambient-lightning') || document.createElement('div');
      ambientLightning.className = 'alltilt-ambient-lightning';
      const ambientLightningTransformStr = 'rotate(180deg) translate(-50%, -50%)';
      const ambientLightningStyle = ambientLightning.style;
      ambientLightningStyle.background = 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)';
      ambientLightningStyle.position = 'absolute';
      ambientLightningStyle.top = '50%';
      ambientLightningStyle.left = '50%';
      ambientLightningStyle.webkitTransform = ambientLightningTransformStr;
      ambientLightningStyle.MozTransform = ambientLightningTransformStr;
      ambientLightningStyle.msTransform = ambientLightningTransformStr;
      ambientLightningStyle.OTransform = ambientLightningTransformStr;
      ambientLightningStyle.transform = ambientLightningTransformStr;
      ambientLightningStyle.transformOrigin = '50% 50%';
      ambientLightningStyle.opacity = 0;

      ambientLightningContainer.appendChild(ambientLightning);
      
    }
    
  };
  
  const tiltMove = function() {
    this.values = prepareValues.call(this, event);
    updTransform(this, this.values);
  };
  
  const updTransform = function(el, val) {
    
    let transformStr = 'perspective(' + settings.perspective + 'px)';
    
    if ( settings.axis == 'x' ) {
      transformStr += ' rotateY(' + val.degY + 'deg)';
    } else if ( settings.axis == 'y' ) {
      transformStr += 'rotateX(' + val.degX + 'deg)';
    } else {
      transformStr += 'rotateX(' + val.degX + 'deg) rotateY(' + val.degY + 'deg)';
    }
    
    if ( settings.scale && !isNaN(settings.scale) ) {
      transformStr += ' scale3d(' + settings.scale + ',' + settings.scale + ',1)';
    } else {
      transformStr += ' scale3d(1,1,1)';
    }
    
    el.style.webkitTransform = transformStr;
    el.style.MozTransform = transformStr;
    el.style.msTransform = transformStr;
    el.style.OTransform = transformStr;
    el.style.transform = transformStr;
    
    if ( settings.ambientLightning ) {
      const elAmbientLightning = el.querySelector('.alltilt-ambient-lightning');
      const lightningDimensions = Math.max( val.elemH, val.elemW );
      const lightningStyle = elAmbientLightning.style;
      const lightningTransformStr = 'translate(-50%, -50%) rotate(' + val.ambientAngle + 'deg)';
      lightningStyle.width = lightningDimensions * 2 + 'px';
      lightningStyle.height = lightningDimensions * 2 + 'px';
      lightningStyle.webkitTransform = transformStr;
      lightningStyle.MozTransform = transformStr;
      lightningStyle.msTransform = transformStr;
      lightningStyle.OTransform = transformStr;
      lightningStyle.transform = lightningTransformStr;
      lightningStyle.opacity = val.ambientOpacity;
    }
    
  };
  
  const tiltEnter = function() {
    const _this = this;
    
    if ( settings.ambientLightning ) {
      const _elAmbientLightning = _this.querySelector('.alltilt-ambient-lightning');
      _elAmbientLightning.style.transition = 'opacity ' + settings.transitionDuration + 'ms ' + settings.easing;
    }
    
    _this.style.transition = 'transform ' + settings.transitionDuration + 'ms ' + settings.easing;
    setTimeout( function() {
      _this.style.removeProperty('transition');
      if ( settings.ambientLightning ) {
        _this.querySelector('.alltilt-ambient-lightning').style.removeProperty('transition');
      }
    }, settings.transitionDuration);

  }
  
  const resetTransforms = function() {
    const elStyle = this.style;
    elStyle.transition = 'transform ' + settings.transitionDuration + 'ms ease-in-out';
    elStyle.webkitTransform = initTransforms;
    elStyle.MozTransform = initTransforms;
    elStyle.msTransform = initTransforms;
    elStyle.OTransform = initTransforms;
    elStyle.transform = initTransforms;
    if ( settings.ambientLightning ) {
      this.querySelector('.alltilt-ambient-lightning').style.transition = 'opacity ' + settings.transitionDuration + 'ms ease-in-out';
      this.querySelector('.alltilt-ambient-lightning').style.opacity = 0;
    }
  };
  
  // Emulate Pointer Events on mobile Devices
  function touchHandler(event) {
    var touches = event.changedTouches,
        first = touches[0],
        type;
    
    switch(event.type) {
      case 'touchstart':
        type = 'mouseenter'; 
        break;
      case 'touchmove': 
        type = 'mousemove';
        break;
      case 'touchcancel':
      case 'touchend':
        type = 'mouseleave';
        break;
      default:
        return;
    }

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
  }
  
  const BindEvents = function(e) {
    const _this = this;
    initTiltContainer(_this, true);
    window.addEventListener('resize', function(e) {
      initTiltContainer(_this, false); 
    });
    _this.addEventListener('mouseenter', tiltEnter);
    _this.addEventListener('mousemove', tiltMove);
    _this.addEventListener('mouseleave', resetTransforms);
    // Enable Touch
    // _this.addEventListener("touchstart", touchHandler, true);
    // _this.addEventListener("touchmove", touchHandler, true);
    // _this.addEventListener("touchend", touchHandler, true);
    // _this.addEventListener("touchcancel", touchHandler, true);   
  };
  
  this.init = () => {
    // Bind events
    BindEvents.call(this);
  };
  
  this.init();
  
}

document.addEventListener('DOMContentLoaded', function() {
  var tiltedElements = document.querySelectorAll('.tilt');
  
  tiltedElements.forEach((element) => {
    element.allTilt();
  });
  
  // hljs.initHighlightingOnLoad();
});
