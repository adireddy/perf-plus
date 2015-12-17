import pixi.core.display.Container;
import js.Browser;
import pixi.core.textures.Texture;
import pixi.plugins.app.Application;

class Main extends Application {

	var wabbitTexture:Texture;

	var bunnys:Array<Bunny> = [];
	var bunnyTextures:Array<Texture> = [];
	var gravity:Float = 0.5;

	var maxX:Float;
	var minX:Float = 0;
	var maxY:Float;
	var minY:Float = 0;

	var startBunnyCount:Int = 2;
	var isAdding:Bool = false;
	var count:Int = 0;
	var container:Container;

	var amount:Int = 100;

	var stats:PerfPlus;

	public function new() {
		super();
		_init();
	}

	function _init() {
		//stats = new PerfPlus();
		/*haxe.Timer.delay(function() {
			stats.start();
		}, 3000);*/

		backgroundColor = 0xFFFFFF;
		onUpdate = _onUpdate;
		onResize = _onResize;
		super.start();
		_setup();
	}

	function _setup() {
		maxX = Browser.window.innerWidth;
		maxY = Browser.window.innerHeight;

		container = new Container();
		stage.addChild(container);

		var bunny1 = Texture.fromImage("assets/bunnymark/bunny1.png");
		var bunny2 = Texture.fromImage("assets/bunnymark/bunny2.png");
		var bunny3 = Texture.fromImage("assets/bunnymark/bunny3.png");
		var bunny4 = Texture.fromImage("assets/bunnymark/bunny4.png");
		var bunny5 = Texture.fromImage("assets/bunnymark/bunny5.png");

		bunnyTextures = [bunny1, bunny2, bunny3, bunny4, bunny5];

		for (i in 0 ... startBunnyCount) {
			var b:Bunny = new Bunny(bunnyTextures[Std.random(5)]);
			b.speedX = Math.random() * 5;
			b.speedY = (Math.random() * 5) - 3;
			b.anchor.set(0.5, 1);
			bunnys.push(b);
			container.addChild(b);
		}
	}

	function _onUpdate(elapsedTime:Float) {
		if (isAdding) {
			if (count < 200000) {
				for (i in 0 ... amount) {
					var b = new Bunny(bunnyTextures[Std.random(5)]);
					b.speedX = Math.random() * 5;
					b.speedY = (Math.random() * 5) - 3;
					b.anchor.set(0.5, 1);
					b.scale.set(0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5);

					bunnys.push(b);
					container.addChild(b);
					count++;
				}
			}
		}

		for (i in 0 ... bunnys.length) {
			bunnys[i].position.x += bunnys[i].speedX;
			bunnys[i].position.y += bunnys[i].speedY;
			bunnys[i].speedY += gravity;

			if (bunnys[i].position.x > maxX) {
				bunnys[i].speedX *= -1;
				bunnys[i].position.x = maxX;
			}
			else if (bunnys[i].position.x < minX) {
				bunnys[i].speedX *= -1;
				bunnys[i].position.x = minX;
			}

			if (bunnys[i].position.y > maxY) {
				bunnys[i].speedY *= -0.85;
				bunnys[i].position.y = maxY;
				if (Math.random() > 0.5) bunnys[i].speedY -= Math.random() * 6;
			}
			else if (bunnys[i].position.y < minY) {
				bunnys[i].speedY = 0;
				bunnys[i].position.y = minY;
			}
		}
	}

	function _onResize() {
		maxX = Browser.window.innerWidth;
		maxY = Browser.window.innerHeight;
	}

	static function main() {
		new Main();
	}
}