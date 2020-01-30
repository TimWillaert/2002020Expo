let originX, originY;
let particles = [];
let revivedParticles = [];
let particlesEmigration = [];
let revivedParticlesEmigration = [];
let target;
let targetEmigration;

let verhouding = 100000;

let immigratie;
let emigratie;

let moduloArrImm = [];
let roundedArrImm = [];

let moduloArrEm = [];
let roundedArrEm = [];

$.ajax({
    url: "json/immigratie.json",
    dataType: "json",
    method: "get"
}).done(function(data){
    immigratie = data;
})

$.ajax({
    url: "json/emigration.json",
    dataType: "json",
    method: "get"
}).done(function(data){
    emigratie = data;
})

function setup(){
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');
    colorMode(RGB, 255, 255, 255, 1);

    originX = windowWidth/2;
    originY = windowHeight/2;
    target = createVector(originX, originY);

    bg = loadImage("img/bg69.png");

    for(var i = 0; i < 10; i++){
        let total = (immigratie[7].Immigratie[i].Mannen + immigratie[7].Immigratie[i].Vrouwen) / 10;
        let rounded = Math.round(total);
        roundedArrImm.push(rounded);
        let modulo = verhouding/rounded;
        let roundedModulo = Math.round(modulo / 10);
        moduloArrImm.push(roundedModulo);
    }

    for(var i = 0; i < 10; i++){
        let total = (emigratie[7].Emigration[i].Mannen + emigratie[7].Emigration[i].Vrouwen) / 10;
        let rounded = Math.round(total);
        roundedArrEm.push(rounded);
        let modulo = verhouding/rounded;
        let roundedModulo = Math.round(modulo / 10);
        moduloArrEm.push(roundedModulo);
    }
}

function draw(){
    background(bg);
    var distance;
    var revivedActive = false;
    var revivedActiveEmigration = false;

    for(var i = 0; i < 10; i++){
        if(frameCount % moduloArrImm[i] == 0 && particles.length <= roundedArrImm[i]){
            distance = i;
            let p = new Particle(distance);
            p.setTarget(originX, originY);
            particles.push(p);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].seek();
        particles[i].update();
        particles[i].show();
        if (particles[i].isDead()) {
        // remove this particle
            let startPos = particles[i].startPosition;
            particles.splice(i, 1);
            let p = new RevivedParticle(startPos);
            p.setTarget(originX, originY);
            revivedParticles.push(p);
            revivedActive = true;
        }
    }

    if(revivedParticles == true){
        for(let i = revivedParticles.length - 1; i >= 0; i--){
                revivedParticles[i].seek();
                revivedParticles[i].update();
                revivedParticles[i].show();
            if (revivedParticles[i].isDead()) {
                // remove this particle
                    let startPos = particles[i].startPosition;
                    revivedParticles.splice(i, 1);
                    let p = new RevivedParticle(startPos);
                    p.setTarget(originX, originY);
                    revivedParticles.push(p);
            }
        }
    }

    /**************************** */

    for(var i = 0; i < 10; i++){
        if(frameCount % moduloArrEm[i] == 0 && particlesEmigration.length <= roundedArrEm[i]){
            let p = new ParticleEmigration();
            p.setTarget(210 + i * 124.5, 660);
            particlesEmigration.push(p);
        }
    }

    for (let i = particlesEmigration.length - 1; i >= 0; i--) {
        particlesEmigration[i].seek();
        particlesEmigration[i].update();
        particlesEmigration[i].show();
        if (particlesEmigration[i].isDead()) {
        // remove this particle
            particlesEmigration.splice(i, 1);
            let p = new RevivedParticleEmigration();
            p.setTarget(210 + i * 124.5, 660);
            revivedParticlesEmigration.push(p);
            revivedActiveEmigration = true;
        }
    }

    if(revivedParticlesEmigration == true){
        for(let i = revivedParticlesEmigration.length - 1; i >= 0; i--){
                revivedParticlesEmigration[i].seek();
                revivedParticlesEmigration[i].update();
                revivedParticlesEmigration[i].show();
            if (revivedParticlesEmigration[i].isDead()) {
                // remove this particle
                    revivedParticlesEmigration.splice(i, 1);
                    let p = new RevivedParticleEmigration();
                    p.setTarget(210 + i * 124.5, 660);
                    revivedParticlesEmigration.push(p);
            }
        }
    }
}

class Particle {
    constructor(distance) {
        this.position = createVector(210 + distance * 125, 85);
        this.startPosition = createVector(210 + distance * 125, 85);
        this.velocity = createVector(random(-1, 1), random(-1, -1));
        this.acceleration = createVector(0, 0.05);
        this.alpha = 255;

        //steering
        this.isSeeking = true;
        this.target = target;
        this.maxspeed = 2;    // Maximum speed
        this.maxforce = 0.08; // Maximum steering force
    }

    seek() {
        if(this.isSeeking) {
            let desired = p5.Vector.sub(this.target,this.position);
            desired.normalize();
            desired.mult(this.maxspeed);

            //steering = desired - snelheid
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);  // Limit to maximum steering force

            this.acceleration.add(steer);
        }
    }

    isDead() {
        return this.alpha < 0.8;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.alpha -= 0.8;

        this.acceleration.mult(0);
    }

    setTarget(posX, posY) {
        this.target = createVector(originX, originY);
        this.isSeeking = true;
    }

    show() {
        noStroke();
        //stroke(255);
        fill(116, 214, 170);
        ellipse(this.position.x, this.position.y, 3);
    }
}

class RevivedParticle {
    constructor(start) {
        this.position = start;
        this.startPosition = start;
        this.velocity = createVector(random(-1, 1), random(-1, -1));
        this.acceleration = createVector(0, 0.05);
        this.alpha = 255;

        //steering
        this.isSeeking = true;
        this.target = target;
        this.maxspeed = 2;    // Maximum speed
        this.maxforce = 0.08; // Maximum steering force
    }

    seek() {
        if(this.isSeeking) {
            let desired = p5.Vector.sub(this.target,this.position);
            desired.normalize();
            desired.mult(this.maxspeed);

            //steering = desired - snelheid
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);  // Limit to maximum steering force

            this.acceleration.add(steer);
        }
    }

    isDead() {
        return this.alpha < 0.8;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.alpha -= 0.8;

        this.acceleration.mult(0);
    }

    setTarget(posX, posY) {
        this.target = createVector(originX, originY);
        this.isSeeking = true;
    }

    show() {
        noStroke();
        //stroke(255);
        fill(116, 214, 170);
        ellipse(this.position.x, this.position.y, 3);
    }
}

/********************************* */
/********************************* */
/********************************* */

class ParticleEmigration {
    constructor(distance) {
        this.position = createVector(originX, originY);
        this.velocity = createVector(random(-1, 1), random(-1, -1));
        this.acceleration = createVector(0, 0.05);
        this.alpha = 255;

        //steering
        this.isSeeking = true;
        this.target = target;
        this.maxspeed = 2;    // Maximum speed
        this.maxforce = 0.08; // Maximum steering force
    }

    seek() {
        if(this.isSeeking) {
            let desired = p5.Vector.sub(this.target,this.position);
            desired.normalize();
            desired.mult(this.maxspeed);

            //steering = desired - snelheid
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);  // Limit to maximum steering force

            this.acceleration.add(steer);
        }
    }

    isDead() {
        return this.alpha < 0.8;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.alpha -= 0.8;

        this.acceleration.mult(0);
    }

    setTarget(posX, posY) {
        this.target = createVector(posX, posY);
        this.isSeeking = true;
    }

    show() {
        noStroke();
        //stroke(255);
        fill(255, 40, 86);
        ellipse(this.position.x, this.position.y, 3);
    }
}

class RevivedParticleEmigration {
    constructor() {
        this.position = createVector(originX, originY);
        this.velocity = createVector(random(-1, 1), random(-1, -1));
        this.acceleration = createVector(0, 0.05);
        this.alpha = 255;

        //steering
        this.isSeeking = true;
        this.target = target;
        this.maxspeed = 2;    // Maximum speed
        this.maxforce = 0.08; // Maximum steering force
    }

    seek() {
        if(this.isSeeking) {
            let desired = p5.Vector.sub(this.target,this.position);
            desired.normalize();
            desired.mult(this.maxspeed);

            //steering = desired - snelheid
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);  // Limit to maximum steering force

            this.acceleration.add(steer);
        }
    }

    isDead() {
        return this.alpha < 0.8;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.alpha -= 0.8;

        this.acceleration.mult(0);
    }

    setTarget(posX, posY) {
        this.target = createVector(posX, posY);
        this.isSeeking = true;
    }

    show() {
        noStroke();
        //stroke(255);
        fill(255, 40, 86)
        ellipse(this.position.x, this.position.y, 3);
    }
}

