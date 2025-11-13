"""
Business: API для работы с системой складского учёта СкладПро
Args: event с httpMethod, body, queryStringParameters; context с request_id
Returns: HTTP response с данными из БД
"""

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    path = event.get('queryStringParameters', {}).get('path', '')
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            if path == 'products':
                cur.execute("""
                    SELECT p.*, c.name as category_name 
                    FROM products p 
                    LEFT JOIN categories c ON p.category_id = c.id 
                    ORDER BY p.id
                """)
                result = cur.fetchall()
                
            elif path == 'orders':
                cur.execute("""
                    SELECT o.*, c.name as customer_name, u.name as user_name
                    FROM orders o
                    LEFT JOIN contractors c ON o.contractor_id = c.id
                    LEFT JOIN users u ON o.user_id = u.id
                    ORDER BY o.created_at DESC
                """)
                result = cur.fetchall()
                
            elif path == 'receipts':
                cur.execute("""
                    SELECT r.*, c.name as supplier_name
                    FROM receipts r
                    LEFT JOIN contractors c ON r.supplier_id = c.id
                    ORDER BY r.created_at DESC
                """)
                result = cur.fetchall()
                
            elif path == 'shipments':
                cur.execute("""
                    SELECT s.*, c.name as customer_name
                    FROM shipments s
                    LEFT JOIN contractors c ON s.customer_id = c.id
                    ORDER BY s.created_at DESC
                """)
                result = cur.fetchall()
                
            elif path == 'warehouse_zones':
                cur.execute("SELECT * FROM warehouse_zones ORDER BY id")
                result = cur.fetchall()
                
            elif path == 'contractors':
                cur.execute("SELECT * FROM contractors ORDER BY id")
                result = cur.fetchall()
                
            elif path == 'inventories':
                cur.execute("""
                    SELECT i.*, w.zone_name, u.name as started_by_name
                    FROM inventories i
                    LEFT JOIN warehouse_zones w ON i.zone_id = w.id
                    LEFT JOIN users u ON i.started_by = u.id
                    ORDER BY i.started_at DESC
                """)
                result = cur.fetchall()
            
            elif path == 'stats':
                cur.execute("SELECT COUNT(*) as total_products FROM products")
                products_count = cur.fetchone()['total_products']
                
                cur.execute("SELECT COUNT(*) as total_orders FROM orders WHERE status != 'Доставлен'")
                active_orders = cur.fetchone()['total_orders']
                
                cur.execute("SELECT COUNT(*) as receipts_today FROM receipts WHERE DATE(created_at) = CURRENT_DATE")
                receipts_today = cur.fetchone()['receipts_today']
                
                cur.execute("SELECT COUNT(*) as shipments_today FROM shipments WHERE DATE(created_at) = CURRENT_DATE")
                shipments_today = cur.fetchone()['shipments_today']
                
                result = {
                    'products_count': products_count,
                    'active_orders': active_orders,
                    'receipts_today': receipts_today,
                    'shipments_today': shipments_today
                }
            else:
                result = {'error': 'Unknown path'}
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            if path == 'register':
                cur.execute("""
                    INSERT INTO users (name, email, password_hash, role) 
                    VALUES (%s, %s, %s, %s) 
                    RETURNING id, name, email, role
                """, (body['name'], body['email'], body['password'], body['role']))
                result = cur.fetchone()
                conn.commit()
                
            elif path == 'order':
                order_number = f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}"
                cur.execute("""
                    INSERT INTO orders (order_number, user_id, status, total_items, notes) 
                    VALUES (%s, %s, %s, %s, %s) 
                    RETURNING id, order_number, status
                """, (order_number, body.get('user_id'), 'В обработке', body.get('quantity', 1), body.get('notes', '')))
                order = cur.fetchone()
                
                cur.execute("""
                    INSERT INTO order_items (order_id, product_id, quantity, price) 
                    VALUES (%s, %s, %s, %s)
                """, (order['id'], body['product_id'], body['quantity'], body['price']))
                
                conn.commit()
                result = order
                
            elif path == 'receipt':
                receipt_number = f"RCP-{datetime.now().strftime('%Y%m%d%H%M%S')}"
                cur.execute("""
                    INSERT INTO receipts (receipt_number, supplier_id, status, total_items, expected_date, notes) 
                    VALUES (%s, %s, %s, %s, %s, %s) 
                    RETURNING id, receipt_number, status
                """, (receipt_number, body.get('supplier_id'), 'Ожидается', body.get('quantity', 0), body.get('delivery_date'), body.get('notes', '')))
                result = cur.fetchone()
                conn.commit()
            else:
                result = {'error': 'Unknown path'}
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            
            if path == 'order_status':
                cur.execute("""
                    UPDATE orders SET status = %s, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = %s 
                    RETURNING id, order_number, status
                """, (body['status'], body['id']))
                result = cur.fetchone()
                conn.commit()
                
            elif path == 'receipt_status':
                cur.execute("""
                    UPDATE receipts SET status = %s, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = %s 
                    RETURNING id, receipt_number, status
                """, (body['status'], body['id']))
                result = cur.fetchone()
                conn.commit()
                
            elif path == 'shipment_status':
                cur.execute("""
                    UPDATE shipments SET status = %s, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = %s 
                    RETURNING id, shipment_number, status
                """, (body['status'], body['id']))
                result = cur.fetchone()
                conn.commit()
            else:
                result = {'error': 'Unknown path'}
        else:
            result = {'error': 'Method not allowed'}
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, default=str)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
