// Plexus Digital FX Technology Background Animation
// Abstract connected nodes/particles with lines forming a network pattern

(function() {
    var canvas = document.createElement('canvas');
    canvas.id = 'plexus-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    document.body.insertBefore(canvas, document.body.firstChild);
    var ctx = canvas.getContext('2d');
    var width, height, particles = [], mouse = {x:null,y:null,radius:150};
    var config = {count:80,size:2,lineDist:150,speed:0.5,color:'200,180,130'};
    function resize(){width=canvas.width=window.innerWidth;height=canvas.height=window.innerHeight;}
    function Particle(){this.x=Math.random()*width;this.y=Math.random()*height;this.vx=(Math.random()-0.5)*config.speed;this.vy=(Math.random()-0.5)*config.speed;this.size=Math.random()*config.size+0.5;this.opacity=Math.random()*0.5+0.3;}
    Particle.prototype.update=function(){if(mouse.x!==null){var dx=this.x-mouse.x,dy=this.y-mouse.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<mouse.radius){var force=(mouse.radius-dist)/mouse.radius;this.vx+=dx/dist*force*0.02;this.vy+=dy/dist*force*0.02;}}var spd=Math.sqrt(this.vx*this.vx+this.vy*this.vy);if(spd>config.speed*2){this.vx=this.vx/spd*config.speed*2;this.vy=this.vy/spd*config.speed*2;}this.x+=this.vx;this.y+=this.vy;if(this.x<0)this.x=width;if(this.x>width)this.x=0;if(this.y<0)this.y=height;if(this.y>height)this.y=0;};
    Particle.prototype.draw=function(){ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fillStyle='rgba('+config.color+','+this.opacity+')';ctx.fill();};
    function init(){particles=[];for(var i=0;i<config.count;i++)particles.push(new Particle());}
    function drawLines(){for(var i=0;i<particles.length;i++)for(var j=i+1;j<particles.length;j++){var dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<config.lineDist){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle='rgba('+config.color+','+(1-dist/config.lineDist)*0.4+')';ctx.lineWidth=0.5;ctx.stroke();}}}
    function animate(){ctx.clearRect(0,0,width,height);particles.forEach(function(p){p.update();p.draw();});drawLines();requestAnimationFrame(animate);}
    window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;});
    window.addEventListener('mouseout',function(){mouse.x=null;mouse.y=null;});
    window.addEventListener('resize',resize);
    resize();init();animate();

    // Smooth text animations
    function initTextAnim(){
        var eyebrow=document.querySelector('.hero-eyebrow');
        var lines=document.querySelectorAll('.title-line');
        var subtitle=document.querySelector('.hero-subtitle');
        var cta=document.querySelector('.hero-cta');
        if(eyebrow){eyebrow.style.opacity='0';eyebrow.style.transform='translateY(20px)';setTimeout(function(){eyebrow.style.transition='opacity 0.8s ease, transform 0.8s ease';eyebrow.style.opacity='1';eyebrow.style.transform='translateY(0)';},300);}
        lines.forEach(function(l,i){l.style.opacity='0';l.style.transform='translateY(40px)';setTimeout(function(){l.style.transition='opacity 0.8s ease, transform 0.8s ease';l.style.opacity='1';l.style.transform='translateY(0)';},500+i*200);});
        if(subtitle){subtitle.style.opacity='0';subtitle.style.transform='translateY(20px)';setTimeout(function(){subtitle.style.transition='opacity 0.8s ease, transform 0.8s ease';subtitle.style.opacity='1';subtitle.style.transform='translateY(0)';},1200);}
        if(cta){cta.style.opacity='0';cta.style.transform='translateY(20px)';setTimeout(function(){cta.style.transition='opacity 0.8s ease, transform 0.8s ease';cta.style.opacity='1';cta.style.transform='translateY(0)';},1500);}
    }
    if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initTextAnim);}else{initTextAnim();}
})();