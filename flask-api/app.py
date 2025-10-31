"""
Flask API 서버 - AutoList 아마존 상품 수집 서비스

주요 기능:
- 아마존 상품 수집 API 제공
- Supabase 데이터베이스 연동
- Next.js 클라이언트와 CORS 통신

환경 변수:
- SUPABASE_URL: Supabase 프로젝트 URL
- SUPABASE_SERVICE_ROLE_KEY: Supabase Service Role Key
- FLASK_ENV: 개발/프로덕션 환경 (development/production)
- FLASK_PORT: 서버 포트 (기본값: 5000)
"""

import os
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime

# 환경 변수 로드
load_dotenv()

# Flask 앱 초기화
app = Flask(__name__)

# CORS 설정 (Next.js와 통신을 위해)
CORS(app, origins=[
    "http://localhost:3000",  # Next.js 개발 서버
    "http://127.0.0.1:3000",
], supports_credentials=True)

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.route('/health', methods=['GET'])
def health_check():
    """Health check 엔드포인트 - 서버 상태 확인용"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'AutoList Flask API'
    }), 200


@app.route('/api/collect-products', methods=['POST'])
def collect_products():
    """아마존 상품 수집 API 엔드포인트 (Phase 2에서 구현 예정)"""
    try:
        data = request.get_json()
        keyword = data.get('keyword') if data else None
        
        if not keyword:
            return jsonify({
                'success': False,
                'error': 'keyword 파라미터가 필요합니다.'
            }), 400
        
        # Phase 2에서 실제 구현 예정
        logger.info(f'상품 수집 요청: keyword={keyword}')
        
        return jsonify({
            'success': True,
            'message': '상품 수집 기능은 Phase 2에서 구현됩니다.',
            'keyword': keyword
        }), 200
        
    except Exception as e:
        logger.error(f'상품 수집 오류: {str(e)}', exc_info=True)
        return jsonify({
            'success': False,
            'error': '서버 오류가 발생했습니다.'
        }), 500


@app.errorhandler(404)
def not_found(error):
    """404 에러 핸들링"""
    return jsonify({
        'success': False,
        'error': '요청한 리소스를 찾을 수 없습니다.'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """500 에러 핸들링"""
    logger.error(f'내부 서버 오류: {str(error)}', exc_info=True)
    return jsonify({
        'success': False,
        'error': '서버 내부 오류가 발생했습니다.'
    }), 500


if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))  # 기본값을 5001로 변경 (macOS AirPlay와 충돌 방지)
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f'Flask 서버 시작: port={port}, debug={debug}')
    app.run(host='0.0.0.0', port=port, debug=debug)

