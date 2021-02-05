const creds = require("./config.json")
const snoowrap = require('snoowrap');

const r = new snoowrap(creds.reddit_info);

var prohibido = ["eyeblech", "wtf", "trypophobia", "fiftyfifty"]

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
module.exports = {
    getRandomArbitrary,
    getImgFromSubReddit(subreddit){
        return new Promise((resolve,reject)=>{
            console.log("Buscando ",subreddit)
            if(subreddit){
                if(prohibido.indexOf(subreddit.toLowerCase()) > -1){
                    reject("PROHIBIDO")
                } else {
                    r.getSubreddit(subreddit).getTop({time: 'all', limit: 100}).then(posts => {
                        if(posts.length > 0) {
                            var p = posts.map(img=>{
                                return img.url
                            }).filter(url=>{
                                return url.match(/\.jpg|\.png|\.gif/i)!== null
                            })
                        
                            var l = p.length
                            var index = getRandomArbitrary(0, l)
                            var url = p[index]
                            if(url){
                                resolve({url, posts: p})
                            } else {
                                reject(reject("Error al buscar publicaciones"))
                            }
                            
                        } else {
                            reject("No se encontraron publicaciones recientes")
                        }
                    }).catch(()=>{
                        reject("Ocurrio un error al buscar publicaciones o el subreddit no esta disponible")
                    })
                }
            } else {
                reject("La cadena no puede ser vacia")
            }
        })
    }
}