import urllib.request, json

payload = {
    'action': 'evaluate',
    'args': {'code': '(function(){const r2=[];for(let s of document.styleSheets){try{for(let r of s.cssRules){if(r.selectorText && (r.selectorText.includes("nav-links") || r.selectorText.includes("mobile-menu"))){r2.push(r.selectorText+" -> "+r.style.cssText)}}}catch(e){}}return JSON.stringify(r2)})()'},
    'session': 'mom-test'
}
req = urllib.request.Request('http://127.0.0.1:10086/command', data=json.dumps(payload).encode(), headers={'Content-Type':'application/json'})
resp = urllib.request.urlopen(req)
print(resp.read().decode())
