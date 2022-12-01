import {Text} from './text.js';
import {Particle} from './particle.js';

export class Visual {
    constructor() {
        this.text = new Text();

        this.texture = PIXI.Texture.from('particle.png');

        this.particles = [];

        this.mouse = {
            x: 0,
            y:0,
            radius: 100,
        };

        this.count = 0;

        this.stage;

        document.addEventListener('pointermove', this.onMove.bind(this), false);
    }
    onMove(e) {
        this.mouse.x= e.clientX;
        this.mouse.y = e.clientY;
    }
    show(str, stageWidth, stageHeight, stage) {
        if (this.container) {
            stage.removeChild(this.container);
        }
        this.stage = stage;

        this.pos = this.text.setText( str, 2,  stageWidth, stageHeight)

        this.container = new PIXI.ParticleContainer(
            this.pos.length,
            {
                vertices: false,
                position: true,
                rotation: false,
                scale: false,
                uvs: false,
                tint: false,

            }
        );

        stage.addChild(this.container);

        this.particles = [];
        for( let i = 0 ; i < this.pos.length; i++ ){
            const item = new Particle( this.pos[i], this.texture);
            this.container.addChild(item.sprite);
            this.particles.push(item);
        }

    }

    animate(r) {
        
        const btn = document.getElementsByClassName("sticky")[0].checked;

        this.count++;
        if( this.count == 600){
            this.count = 0;
            let rand = Math.random() *25 + 65;
            let char = String.fromCharCode(rand);
            
            let colors = '0x'+Math.round(Math.random() * 0x000fff).toString(16);
            
            r.background.color= colors;

            this.show(char, document.body.clientWidth, document.body.clientHeight, this.stage);
        }
        for (let i = 0 ; i < this.particles.length; i++ ){
            const item = this.particles[i];
            const dx = this.mouse.x - item.x;
            const dy = this.mouse.y - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = item.radius + this.mouse.radius;

            if(dist < minDist) {
                const angle = Math.atan2(dy, dx);
                const tx = item.x + Math.cos(angle) * minDist;
                const ty = item.y + Math.sin(angle) * minDist;
                const ax = tx - this.mouse.x;
                const ay = ty - this.mouse.y;
                item.vx -= ax;
                item.vy -= ay;
            }
            item.draw(btn); 
        }
    }
}