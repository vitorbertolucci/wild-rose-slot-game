const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property(cc.Node)
  machine = null;

  @property({ type: cc.AudioClip })
  audioClick = null;

  private block = false;

  private result = null;

  start(): void {
    this.machine.getComponent('Machine').createMachine();
  }

  update(): void {
    if (this.block && this.result != null) {
      this.informStop();
      this.result = null;
    }
  }

  click(): void {
    cc.audioEngine.playEffect(this.audioClick, false);

    if (this.machine.getComponent('Machine').spinning === false) {
      // Starts spin
      this.block = false;
      this.machine.getComponent('Machine').spin();
      this.requestResult();
    } else if (!this.block) {
      // Stops spin
      this.block = true;
      this.machine.getComponent('Machine').lock();
    }
  }

  async requestResult(): Promise<void> {
    this.result = null;
    this.result = await this.getAnswer();
  }

  getAnswer(): Promise<Array<Array<number>>> {
    return new Promise<Array<Array<number>>>(resolve => {
      setTimeout(() => {
        const slotResult = [];

        const chance = this.getRandomInteger(0, 100);
        const chosenTile = this.getRandomInteger(0, 29);

        const { numberOfReels } = this.machine.getComponent('Machine');

        if (chance <= 50) {
          // 50% chance of showing fully random configuration
          const reelWithChosenTiles = [undefined, undefined, undefined];

          for (let i = 0; i < numberOfReels; i += 1) {
            slotResult.push(reelWithChosenTiles);
          }
        } else if (chance <= 50 + 33) {
          // 33% chance of displaying a single line with equal tiles
          const reelWithChosenTiles = [undefined, undefined, undefined];

          const equalLine = this.getRandomInteger(0, 2);
          reelWithChosenTiles[equalLine] = chosenTile;

          for (let i = 0; i < numberOfReels; i += 1) {
            slotResult.push(reelWithChosenTiles);
          }
        } else if (chance <= 50 + 33 + 10) {
          // 10% chance of displaying two lines with equal tiles
          const reelWithChosenTiles = [chosenTile, chosenTile, chosenTile];

          const differentLine = this.getRandomInteger(0, 2);
          reelWithChosenTiles[differentLine] = undefined;

          for (let i = 0; i < numberOfReels; i += 1) {
            slotResult.push(reelWithChosenTiles);
          }
        } else {
          // 7% chance of displaying all lines with equal tiles
          const reelWithChosenTiles = [chosenTile, chosenTile, chosenTile];

          for (let i = 0; i < numberOfReels; i += 1) {
            slotResult.push(reelWithChosenTiles);
          }
        }

        resolve(slotResult);
      }, 1000 + 500 * Math.random());
    });
  }

  informStop(): void {
    const resultRelayed = this.result;
    this.machine.getComponent('Machine').stop(resultRelayed);
  }

  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }
}
