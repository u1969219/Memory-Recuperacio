class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
		this.player = "";
    }	

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
	}
	
    create (){	
		this.cameras.main.setBackgroundColor(0xfdf509);
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
		var options_data = JSON.parse(json);
		var parelles = options_data.cards;
		var nivell_dificultat = options_data.dificulty;
		let vector_cartes = ['co', 'co', 'cb', 'cb', 'sb', 'sb', 'so', 'so', 'tb', 'tb', 'to', 'to'];
		var cartes_jugables = vector_cartes.slice(0, parelles * 2)
	

		var mostrar_cartes_temps = null;			
		var restar_punts = null;

		if (nivell_dificultat == "hard"){
			mostrar_cartes_temps = 500;
			restar_punts = 20;
		}
		else if (nivell_dificultat == "normal"){
			mostrar_cartes_temps = 1000;
			restar_punts = 10;
		}
		else {
			mostrar_cartes_temps = 2000;
			restar_punts = 5;
		}

		var numero = 0;

		cartes_jugables.sort((a, b) => 0.5 - Math.random());

		for (let i = 0; i < parelles*2; i++){
			
			this.add.image(100*i+52, 150, cartes_jugables[numero]);
			numero ++;	
			
		}

		this.cards = this.physics.add.staticGroup();

		for (let i1 = 0; i1 < parelles*2; i1++){
			
			this.cards.create(100*i1+52, 150, 'back');
			
		}

		let i = 0;

		this.cards.children.iterate((card)=>{
			card.card_id = cartes_jugables[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);
				if (this.firstClick){
					if (this.firstClick.card_id !== card.card_id){
						this.score -= restar_punts;

						this.firstClick.enableBody(false, 0, 0, true, true);
						card.enableBody(false, 0, 0, true, true);

						var error = [];
						let comptador = 0;


						for(let i = 0; i < parelles*2; i++){
							let imatge = this.add.image(100*i+52, 150, cartes_jugables[comptador]);
							error.push(imatge);
							comptador++;
						}
						
						setTimeout(() =>{
							for (let i = 0; i < parelles*2; i++){
								error[i].destroy();
							}
						},mostrar_cartes_temps);
				
						
						if (this.score <= 0){
							alert("Game Over");
							loadpage("../");
						}
					}
					else{
						this.correct++;
						if (this.correct >= parelles){
							alert("You Win with " + this.score + " points.");
							loadpage("../");
						}
					}
					this.firstClick = null;
				}
				else{
					console.log(card);
					this.firstClick = card;
				}
			}, card);
		});
	}
	
}

