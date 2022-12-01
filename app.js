//import {Text} from './text.js'; 6:33에서 삭제
import {Visual} from './visual.js';
class App {
    constructor() {

        this.setWebgl();


        //fonts
        WebFont.load({
        google: {
            families: ['Hind:700']
        } ,
        fontactive: () => {
               /*
                this.text = new Text();
                this.text.setText(
                    'A',
                    2,
                    document.body.clientWidth,
                    document.body.clientHeight,
                );  5:33, 그리고 6:33에서 삭제 */
                
                this.Visual = new Visual();

                window.addEventListener('resize', this.resize.bind(this), false);
                this.resize();
                
                requestAnimationFrame(this.animate.bind(this));
            } 
        });

        


    }
    setWebgl(){
        this.renderer = new PIXI.Renderer({
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            antialias: true,
            transparent: false,
            resolution: (window.devicePixelRatio > 1 ) ? 2 : 1,
            autoDensity: true,
            powerPreference: "high-performance",
            backgroundColor: 0x433f3b , //배경 색 

        });
        
        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();

        const blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = 10;
        blurFilter.autoFit = true;

        const fragSource = `
        precision mediump float;
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float threshold;
        uniform float mr;
        uniform float mg;
        uniform float mb;
        void main(void) {
            vec4 color = texture2D(uSampler, vTextureCoord);
            vec3 mcolor = vec3( mr , mg , mb);
            if (color.a > threshold) {
                gl_FragColor = vec4(mcolor, 1.0);
            } else {
                gl_FragColor = vec4(vec3(0.0), 0.0);
            }
        }`;

        const uniformsData = {
            threshold: 0.3,
            mr: 201.0 / 255.0,
            mg: 201.0 / 255.0,
            mb: 199.0 / 255.0,  //글자 색 rgb
        };

        const thresholdFilter = new PIXI.Filter(null, fragSource, uniformsData);
        this.stage.filters = [ blurFilter, thresholdFilter];
        this.stage.filterArea = this.renderer.screen;
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.renderer.resize(this.stageWidth, this.stageHeight)

        this.Visual.show('A', this.stageWidth, this.stageHeight, this.stage);
    }

    animate(t) {
    
        requestAnimationFrame( this.animate.bind(this));

        this.Visual.animate(this.renderer);

        this.renderer.render(this.stage);
    }
}

window.onload = () => {
    new App();
}