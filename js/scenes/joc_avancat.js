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
		let vector_cartes = ['co', 'co', 'cb', 'cb', 'sb', 'sb', 'so', 'so', 'tb', 'tb', 'to', 'to'];
		this.cameras.main.setBackgroundColor(0xfdf509);
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
		var options_data = JSON.parse(json);
		var parellesPares = options_data.cards;
		var nivell_dificultat = options_data.dificulty;
		var cartes_jugables = vector_cartes.slice(0, parellesPares * 2)
	

		var mostrar_cartes_temps = null;			
		var restar_punts = 10;
		
		this.score = 100;
		var quin = 0;

		cartes_jugables.sort((a, b) => 0.5 - Math.random());

		for (let iterador = 0; iterador < parellesPares*2; iterador++){
			
			this.add.image(100*iterador+52, 150, cartes_jugables[quin]);
			quin += 1;	
			
		}

		this.cards = this.physics.add.staticGroup();

		for (let iterador1 = 0; iterador1 < parellesPares*2; iterador1++){
			
			this.cards.create(100*iterador1+52, 150, 'back');
			
		}

		let i = 0;
		
		var nivells = 0;
		
		var mostrar_cartes_temps = null;			
		if (nivell_dificultat == "hard"){
			mostrar_cartes_temps = 500;
		}
		else if (nivell_dificultat == "normal"){
			mostrar_cartes_temps = 1000;
		}
		else {
			mostrar_cartes_temps = 2000;
		}
		
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

						var fallo = [];
						let aux = 0;


						for(let i = 0; i < parellesPares*2; i++){
							let imatge = this.add.image(100*i+52, 150, cartes_jugables[aux]);
							fallo.push(imatge);
							aux++;
						}
						
						setTimeout(() =>{
							for (let iterador = 0; iterador < parellesPares*2; iterador++){
								fallo[iterador].destroy();
							}
						},mostrar_cartes_temps);
				
						if (this.score <= 0){
							alert("Game Over");
							options_data.cards = 2;
							options_data.dificulty = "easy";
							options_data.puntsPerd = 10;	
							sessionStorage.setItem("config", JSON.stringify(options_data));
							loadpage("../");
						}
					}
					else{
						this.correct++;
						if (this.correct >= parellesPares){
							nivells ++;
							this.correct = 0;
							if (parellesPares < 6) parellesPares++;
							
							if (nivell_dificultat == "easy"){
								nivell_dificultat = "normal";
							}
							else if (nivell_dificultat == "normal"){
								nivell_dificultat = "hard";
							}
							
							restar_punts += 10;

							options_data.cards = parellesPares;
							options_data.dificulty = nivell_dificultat;
							options_data.puntsPerd = restar_punts;	
							sessionStorage.setItem("config", JSON.stringify(options_data));

							this.scene.restart();
							
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

