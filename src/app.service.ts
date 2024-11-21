import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getProject(): string {
    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <title>CookBook Backend</title> 
        <style>
          body {
            background: linear-gradient(135deg, #1f1c2c, #928dab);
            color: #ffffff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            overflow: hidden;
            position: relative;
          }

          .button-container {
            position: relative;
            display: inline-block;
          }

          .loading-circle {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 400px;
            height: 400px;
            margin: -200px 0 0 -200px;
            border: 5px solid rgba(255, 255, 255, 0.2);
            border-top: 8px solid #ff00ff;
            border-radius: 50%;
            animation: spin 10s cubic-bezier(0.15, 0.55, 1.0, 0.15) infinite;
            filter: drop-shadow(0 0 10px #ff00ff) drop-shadow(0 0 20px #ff00ff);
            box-sizing: border-box;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(7200deg);
            }
          }

          a {
            display: inline-block;
            padding: 20px 40px;
            font-size: 24px;
            color: #ffffff;
            background-color: #ff00ff;
            text-decoration: none;
            border-radius: 10px;
            transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
            box-shadow: 0 0 15px #ff00ff, 0 0 30px #ff00ff;
            position: relative;
            z-index: 1;
          }
          a:hover {
            background-color: #ff66ff;
            box-shadow: 0 0 25px #ff66ff, 0 0 40px #ff66ff;
            transform: scale(1.05);
          }
        </style>
      </head>
      <body>
        <div class="button-container">
          <div class="loading-circle"></div>
          <a href="/api">Đến trang API</a>
        </div>
      </body>
      </html>
    `;
  }
}
