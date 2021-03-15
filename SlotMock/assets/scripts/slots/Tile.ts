const { ccclass, property } = cc._decorator;

@ccclass
export default class Tile extends cc.Component {
  @property({ type: [cc.SpriteFrame], visible: true })
  private textures = [];

  async onLoad(): Promise<void> {
    await this.loadTextures();
  }

  async resetInEditor(): Promise<void> {
    await this.loadTextures();
    this.setRandom();
  }

  async loadTextures(): Promise<boolean> {
    const self = this;
    return new Promise<boolean>(resolve => {
      cc.loader.loadResDir('gfx/Square', cc.SpriteFrame, function afterLoad(err, loadedTextures) {
        self.textures = loadedTextures;
        resolve(true);
      });
    });
  }

  setTile(index: number, glowInterval?: number): void {
    this.node.getComponent(cc.Sprite).spriteFrame = this.textures[index];

    const animation = this.node.getChildByName('GlowAnimation');

    if (animation) {
      animation.active = false;

      if (glowInterval) {
        // glowInterval is defined when a result pattern is applied, so the animation should be displayed when the spinning ends
        setTimeout(() => {
          animation.active = true;
        }, glowInterval);
      }
    }
  }

  setRandom(): void {
    const randomIndex = Math.floor(Math.random() * this.textures.length);
    this.setTile(randomIndex);
  }
}
