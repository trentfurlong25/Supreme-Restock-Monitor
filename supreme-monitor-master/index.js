/* Modules */
const request = require('request')

/* Config */
let config = {
    "webhook": "https://discordapp.com/api",
    "delay": 3000, /* In Miliseconds */
    "productUrl": "https://supremenewyork.com/shop/product/here"
}
console.log('Starting Up Monitor...')

/* Main */
let ticker = "1"
/* Manage Delay And Loop */
function timeOut() {
    setTimeout(function () {
        let headers = {
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.9',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive'
        }
        let opts = {
            url: `${productUrl}.json`,
            headers: headers,
            gzip: true
        }
        /* Send Request */
        request(opts, function(err, res, body) {
            let parsed = JSON.parse(body)
            let colors = parsed['styles']
            colors.forEach(color => {
                let colorName = color['name']
                let imageUrl = color['image_url']
                let sizes = color['sizes']
                sizes.forEach(size => {
                    let sizeName = size['name']
                    let stockLevel = size['stock_level']
                    /* If Size In Stock */
                    if (stockLevel == "1" && ticker == "1") {
                        console.log('Product In Stock!')
                        /* Send Webhook */
                        let opts = {
                            url: config.webhook,
                            method: 'POST',
                            headers: headers,
                            json: {
                                "embeds": [{
                                    "title": config.productUrl,
                                    "color": 1768289,
                                    "footer": {
                                      "icon_url": "https://pbs.twimg.com/profile_images/1005319991359606784/QJYwS7QJ_400x400.jpg",
                                      "text": "Supreme Monitor | Made By @grxyl"
                                    },
                                    "thumbnail": {
                                      "url": `https:${imageUrl}`
                                    },
                                    "fields": [
                                      {
                                        "name": "Size",
                                        "value": sizeName,
                                        "inline": true
                                      },
                                      {
                                        "name": "Color",
                                        "value": colorName,
                                        "inline": true
                                      }
                                    ]
                                }]
                            }
                        }
                        request(opts)
                        console.log('Sent Hook!')
                        let ticker = "0"
                    } 
                    else if (stockLevel == "0") {
                        let ticker = "1"
                    }
                });
            });
        })
        timeOut();
    }, config.delay);
}
timeOut()
