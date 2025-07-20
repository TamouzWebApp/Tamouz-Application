@@ .. @@
     updateStatus(status) {
       const indicator = document.getElementById('firebase-status');
       if (!indicator) return;
 
-      const isConnected = status.connected;
+      const isConnected = status.connected && status.authenticated;
       const statusText = indicator.querySelector('.status-text');
       const statusDot = indicator.querySelector('.status-dot');
       
       if (isConnected) {
-        statusText.textContent = 'متصل';
+        statusText.textContent = status.authenticated ? 'متصل ومصادق' : 'متصل';
         statusDot.className = 'status-dot connected';
         indicator.title = 'متصل بـ Firebase';
       } else {
-        statusText.textContent = 'غير متصل';
+        statusText.textContent = status.authenticated ? 'غير متصل' : 'غير مصادق';
         statusDot.className = 'status-dot disconnected';
-        indicator.title = 'غير متصل بـ Firebase';
+        indicator.title = status.authenticated ? 'غير متصل بـ Firebase' : 'غير مصادق مع Firebase';
       }
     }
@@ .. @@