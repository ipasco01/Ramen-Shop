import * as THREE from 'three'
import Experience from '../Experience.js'
import chromaVertexShader from '../../shaders/chromaShaders/vertex.glsl'
import chromaFragmentShader from '../../shaders/chromaShaders/fragment.glsl'
import TransitionVertexShader from '../../shaders/transitionShaders/vertex.glsl'
import TransitionFragmentShader from '../../shaders/transitionShaders/fragment.glsl'
import SlideTransitionFragmentShader from '../../shaders/transitionShaders/slideFragment.glsl'
import hologramVertexShader from '../../shaders/hologramShaders/vertex.glsl'
import hologramFragmentShader from '../../shaders/hologramShaders/fragment.glsl'

export default class Materials
{
    constructor()
    {
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.preLoader = this.experience.preLoader
        this.config = this.experience.config

        this.mapColors()

        // Wait for textures
        this.resources.on('ready', () =>
        {
            this.mapTextures()
        })

        this.preLoader.on('start', () =>
        {
            // Setup
            this.config.touch = this.experience.config.touch
            this.mapEasel()
        }) 

        // Debug
        this.debugObject = {}
        this.debugObject.color = '#42f2ff'
    }

    mapColors()
    {
        // non-glowing lights
        this.greenSignMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#1EFF51')})
        this.redSignMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#FF0033')})
        this.whiteSignMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#FFFFFF')})
        this.blackSignMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#000000')})
        this.pinkSignMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#FF2FD5')})
        this.blueSignMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#01DDFF')})
        this.orangeSignMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#FF5100')})
        this.redLedMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#FF112B')})
        this.greenLedMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#00FF00')})
        this.grayLedOffMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#585858')})
        this.grayLedOnMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#FFFFFF')})

        // glowing lights
        this.neonYellowMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#FFF668')})
        this.neonPinkMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#FF3DCB')})
        this.neonBlueMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#00BBFF')})
        this.poleLightMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#FF5EF1')})
        this.neonGreenMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('#56FF54')})
    } 

    mapTextures()
    {

        // map baked textures
        this.ramenShopMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.ramenShopBakedTexture })
        this.machinesMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.machinesBakedTexture })
        this.floorMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.floorBakedTexture })
        this.miscMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.miscBakedTexture })
        this.graphicsMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.graphicsBakedTexture })

        // map matcap textures
        this.dishMatcapMaterial = new THREE.MeshMatcapMaterial({matcap: this.resources.items.dishMatcapTexture, side: THREE.DoubleSide})
        this.fanMatcapMaterial = new THREE.MeshMatcapMaterial({matcap: this.resources.items.fanMatcapTexture})
        this.lightMatcapMaterial = new THREE.MeshMatcapMaterial({matcap: this.resources.items.lightMatcapTexture})
        this.neonBlueMatcapMaterial = new THREE.MeshMatcapMaterial({matcap: this.resources.items.neonBlueMatcapTexture})
        this.neonGreenMatcapMaterial = new THREE.MeshMatcapMaterial({matcap: this.resources.items.neonGreenMatcapTexture})

        // map screen textures
        this.bigScreenMaterial = this.getTransitionShaderMaterial(this.resources.items.bigScreenDefaultTexture)
        this.arcadeScreenMaterial = this.getTransitionShaderMaterial(this.resources.items.arcadeScreenDefaultTexture)
        this.vendingMachineScreenMaterial = this.getTransitionShaderMaterial(this.resources.items.vendingMachineDefaultTexture)

        this.sideScreenMaterial = this.getSideScreenShaderMaterial(this.resources.items.sideScreen1Texture)

        // Map video textures

        // https://discourse.threejs.org/t/basis-video-texture/12716/2

        this.littleTVScreenVideoMaterial = this.getChromaKeyShaderMaterial(this.resources.items.littleTVScreenVideoTexture, new THREE.Color("rgb(0, 255, 0)"));
        this.tallScreenVideoMaterial = this.getChromaKeyShaderMaterial(this.resources.items.tallScreenVideoTexture, new THREE.Color("rgb(0, 255, 0)"));
        this.tvScreenVideoMaterial = this.getChromaKeyShaderMaterial(this.resources.items.tvScreenVideoTexture, new THREE.Color("rgb(0, 255, 0)"));

        this.smallScreen1Material = this.getTransitionShaderMaterial(this.resources.items.smallScreenOne1)
        this.smallScreen2Material = this.getTransitionShaderMaterial(this.resources.items.smallScreenTwo1)

        this.smallScreen3VideoMaterial = this.getChromaKeyShaderMaterial(this.resources.items.smallScreen3VideoTexture, new THREE.Color("rgb(0, 255, 0)"));
        this.smallScreen4VideoMaterial = this.getChromaKeyShaderMaterial(this.resources.items.smallScreen4VideoTexture, new THREE.Color("rgb(0, 255, 0)"));
        this.smallScreen5VideoMaterial = this.getChromaKeyShaderMaterial(this.resources.items.smallScreen5VideoTexture, new THREE.Color("rgb(0, 255, 0)"));
        
        // play the videos
        for ( let i = 0; i < Object.keys(this.resources.video).length; i ++ ) {
            this.resources.video[Object.keys(this.resources.video)[i]].play()
        }

        // Shader Materials

        this.hologramBaseMaterial = new THREE.ShaderMaterial({
          vertexShader: hologramVertexShader,
          fragmentShader: hologramFragmentShader,
          side: THREE.DoubleSide,
          transparent: true,
          uniforms:{
              uTime: { value: 0},
              uBigGridThickness: {value : 0.13},
              uLittleGridThickness: {value : 0.1},
              uBigGridFrequency: {value : 8.0},
              uLittleGridFrequency: {value : 24.0},
              uSpeed : {value: 0.8},
              uColor: {value: new THREE.Color(this.debugObject.color)},
          }
        })

        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('hologramBase')
            this.debugFolder.add(this.hologramBaseMaterial.uniforms.uBigGridThickness, 'value').min(0).max(1).step(0.001).name('uBigGridThickness')
            this.debugFolder.add(this.hologramBaseMaterial.uniforms.uLittleGridThickness, 'value').min(0).max(1).step(0.001).name('uLittleGridThickness')
            this.debugFolder.add(this.hologramBaseMaterial.uniforms.uBigGridFrequency, 'value').min(0).max(10).step(1).name('uBigGridFrequency')
            this.debugFolder.add(this.hologramBaseMaterial.uniforms.uLittleGridFrequency, 'value').min(0).max(30).step(1).name('uLittleGridFrequency')
            this.debugFolder.add(this.hologramBaseMaterial.uniforms.uSpeed, 'value').min(0).max(3).step(0.001).name('uSpeed')          
        }



        this.resources.trigger('texturesMapped')
    }

    mapEasel()
    {
      if(this.config.touch === true)
      {
        this.easelMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.easelTouchTexture })
      }
      else{
        this.easelMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.easelClickTexture })
      }

      this.ramenShop = this.experience.world.ramenShop
      this.ramenShop.setEaselMaterial()
    }

    getChromaKeyShaderMaterial(texture, color) {
    
        return new THREE.ShaderMaterial({
          side: THREE.FrontSide,
          transparent: true,
          uniforms: {
            map: {
              value: texture
            },
            keyColor: {
              value: color.toArray()
            },
            similarity: {
              value: 0.01
            },
            smoothness: {
              value: 0.0
            }
          },
          vertexShader: chromaVertexShader,
          fragmentShader: chromaFragmentShader
        });
      }
    
    getTransitionShaderMaterial(texture) {
  
      return new THREE.ShaderMaterial({
        side: THREE.FrontSide,
        uniforms: {
          texture1: {value: texture },
          progress: {value: 0 },
          texture2: {value: null },
        },
        // wireframe: true,
        vertexShader: TransitionVertexShader,
        fragmentShader: TransitionFragmentShader
      });
    }

    getSideScreenShaderMaterial(texture) {
  
      return new THREE.ShaderMaterial({
        side: THREE.FrontSide,
        uniforms: {
          texture1: {value: texture },
          progress: {value: 0 },
          texture2: {value: null },
        },
        // wireframe: true,
        vertexShader: TransitionVertexShader,
        fragmentShader: SlideTransitionFragmentShader
      });
    }


}



