Signal vs pipe
- use signal if you want to limit data so it can render a lesser data in the UI
- use signal for complex
- use pipe for quick or easy transformation



[...List] vs List on Signal Based

Aspect	             [...list]	           list (in-place)
Triggers reactivity 	✅ Yes	              ❌ No
Performance (small)	  ✅ Good enough	      ✅ Great
Performance (large)	  ❌ Can be costly	    ✅ Fast
Safe for composition	✅ Yes             	❌ Risky
Best practice	        ✅ Preferred in reactive logic	❌ Avoid unless necessary