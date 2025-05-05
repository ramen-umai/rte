/*
   Created with ExtForge
   https://jwklong.github.io/extforge
*/
(async function (Scratch) {
    const variables = {};
    
    
    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }
    
    const ExtForge = {
        Broadcasts: new function() {
            this.raw_ = {};
            this.register = (name, blocks) => {
                this.raw_[name] = blocks;
            };
            this.execute = async (name) => {
                if (this.raw_[name]) {
                    await this.raw_[name]();
                };
            };
        },
    
        Variables: new function() {
            this.raw_ = {};
            this.set = (name, value) => {
                this.raw_[name] = value;
            };
            this.get = (name) => {
                return this.raw_[name] ?? null;
            }
        },
    
        Utils: {
            setList: (list, index, value) => {
                list[index] = value;
                return list;
            },
            lists_foreach: {
                index: [],
                value: []
            },
            countString: (x, y) => {
                return y.length == 0 ? 0 : x.split(y).length - 1
            }
        }
    }
    
    class Extension {
    getInfo() {
       return {"id":"strings","name":"strings","color1":"#58dfcf","blocks":[{"opcode":"block_451925c280b2426f","text":"[bd08e0520a5cbbc9] と [27632817f69bfdbf] と [e184e11b07435bab]","blockType":"reporter","arguments":{"bd08e0520a5cbbc9":{"type":"string"},"27632817f69bfdbf":{"type":"string"},"e184e11b07435bab":{"type":"string"}}},{"opcode":"block_512b47f43f61c4f0","text":"[434698d3c7430c43] を [776cdc636334e449] 回繰り返す","blockType":"reporter","arguments":{"434698d3c7430c43":{"type":"string"},"776cdc636334e449":{"type":"number"}}},{"opcode":"block_709a928e459b9a98","text":"[d8a81ac8aa929285] の [4ea94c4177ab9ff5] ～ [4ad62b152047d876] 文字目","blockType":"reporter","arguments":{"d8a81ac8aa929285":{"type":"string"},"4ea94c4177ab9ff5":{"type":"number"},"4ad62b152047d876":{"type":"number"}}},{"opcode":"block_98eccdce19bf1f5c","text":"[97a2ce62db3d62b9] は [c0a258d5b32a5133] で終わる","blockType":"Boolean","arguments":{"97a2ce62db3d62b9":{"type":"string"},"c0a258d5b32a5133":{"type":"string"}}},{"opcode":"block_80859950accab62f","text":"[84cd20ac6e34e4b9] は [c89e68726338dea7] で始まる","blockType":"Boolean","arguments":{"84cd20ac6e34e4b9":{"type":"string"},"c89e68726338dea7":{"type":"string"}}},{"opcode":"block_9fe7a088c59aaa93","text":"[3852433b741bd484] の中の [9a0b403a36dcec3c] の数","blockType":"reporter","arguments":{"3852433b741bd484":{"type":"string"},"9a0b403a36dcec3c":{"type":"string"}}}]}
    }
    async block_451925c280b2426f(args) {   return (String.prototype.concat(args["bd08e0520a5cbbc9"], args["27632817f69bfdbf"], args["e184e11b07435bab"])) }
    async block_512b47f43f61c4f0(args) {   return ((args["434698d3c7430c43"].repeat(args["776cdc636334e449"]))) }
    async block_709a928e459b9a98(args) {   return ((args["d8a81ac8aa929285"].substring(args["4ea94c4177ab9ff5"], args["4ad62b152047d876"]))) }
    async block_98eccdce19bf1f5c(args) {   return ((args["97a2ce62db3d62b9"].endsWith(args["c0a258d5b32a5133"]))) }
    async block_80859950accab62f(args) {   return (((args["84cd20ac6e34e4b9"].substring((1), (1))) == args["c89e68726338dea7"])) }
    async block_9fe7a088c59aaa93(args) {   return (ExtForge.Utils.countString(args["3852433b741bd484"], args["9a0b403a36dcec3c"])) }
    }
    
    let extension = new Extension();
    // code compiled from extforge
    
    Scratch.extensions.register(extension);
    })(Scratch);