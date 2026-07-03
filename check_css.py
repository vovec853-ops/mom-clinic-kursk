import urllib.request, json

payload = {
    'action': 'evaluate',
    'args': {'code': 'const rules=[];for(let s of document.styleSheets){try{for(let r of s.cssRules){if(r.selectorText && r.selectorText.includes("accessibility-mode")){rules.push(r.selectorText+" -> "+r.style.cssText)}}}catch(e){}}JSON.stringify(rules)'},
    'session': 'mom-test'
}
req = urllib.request.Request('http://127.0.0.1:10086/command', data=json.dumps(payload).encode(), headers={'Content-Type':'application/json'})
resp = urllib.request.urlopen(req)
print(resp.read().decode())
