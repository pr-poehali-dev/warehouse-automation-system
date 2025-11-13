import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';

type UserRole = 'buyer' | 'operator' | 'supplier';

interface User {
  name: string;
  email: string;
  role: UserRole;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer' as UserRole
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      name: registerForm.name,
      email: registerForm.email,
      role: registerForm.role
    };
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const mockData = {
    stats: [
      { label: 'Товаров на складе', value: '1,248', icon: 'Package', change: '+12%' },
      { label: 'Активных заказов', value: '87', icon: 'ShoppingCart', change: '+8%' },
      { label: 'Приёмки сегодня', value: '24', icon: 'TrendingUp', change: '+5%' },
      { label: 'Отгрузки сегодня', value: '31', icon: 'TrendingDown', change: '-3%' }
    ],
    products: [
      { id: 1, name: 'Товар А', sku: 'SKU-001', category: 'Категория 1', quantity: 150, location: 'A-01-01' },
      { id: 2, name: 'Товар Б', sku: 'SKU-002', category: 'Категория 2', quantity: 75, location: 'A-02-03' },
      { id: 3, name: 'Товар В', sku: 'SKU-003', category: 'Категория 1', quantity: 200, location: 'B-01-05' }
    ],
    orders: [
      { id: 1, number: 'ORD-001', customer: 'Клиент А', status: 'В обработке', items: 5, date: '2024-11-13' },
      { id: 2, number: 'ORD-002', customer: 'Клиент Б', status: 'Готов к отгрузке', items: 3, date: '2024-11-13' },
      { id: 3, number: 'ORD-003', customer: 'Клиент В', status: 'Доставлен', items: 8, date: '2024-11-12' }
    ],
    receipts: [
      { id: 1, number: 'RCP-001', supplier: 'Поставщик А', status: 'Ожидается', items: 120, date: '2024-11-14' },
      { id: 2, number: 'RCP-002', supplier: 'Поставщик Б', status: 'Принято', items: 85, date: '2024-11-13' }
    ],
    shipments: [
      { id: 1, number: 'SHP-001', customer: 'Клиент А', status: 'Отгружено', items: 15, date: '2024-11-13' },
      { id: 2, number: 'SHP-002', customer: 'Клиент Б', status: 'В пути', items: 22, date: '2024-11-13' }
    ],
    warehouse: [
      { zone: 'Зона А', capacity: '80%', items: 450, location: 'Стеллажи 1-10' },
      { zone: 'Зона Б', capacity: '65%', items: 320, location: 'Стеллажи 11-20' },
      { zone: 'Зона В', capacity: '45%', items: 180, location: 'Стеллажи 21-30' }
    ],
    inventory: [
      { id: 1, number: 'INV-001', zone: 'Зона А', status: 'В процессе', date: '2024-11-13', progress: 60 },
      { id: 2, number: 'INV-002', zone: 'Зона Б', status: 'Завершена', date: '2024-11-10', progress: 100 }
    ],
    contractors: [
      { id: 1, name: 'Поставщик А', type: 'Поставщик', contact: 'info@supplier-a.ru', orders: 45 },
      { id: 2, name: 'Клиент А', type: 'Клиент', contact: 'sales@client-a.ru', orders: 32 },
      { id: 3, name: 'Поставщик Б', type: 'Поставщик', contact: 'contact@supplier-b.ru', orders: 28 }
    ]
  };

  const canEdit = currentUser?.role === 'operator';

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md p-8 shadow-xl animate-fade-in">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
              <Icon name="Package" size={32} className="text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">СкладПро</h1>
            <p className="text-muted-foreground mt-2">Система управления складом</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                placeholder="Введите имя"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Роль</Label>
              <Select
                value={registerForm.role}
                onValueChange={(value: UserRole) => setRegisterForm({ ...registerForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Покупатель</SelectItem>
                  <SelectItem value="operator">Оператор склада</SelectItem>
                  <SelectItem value="supplier">Поставщик</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Зарегистрироваться
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 h-screen bg-sidebar sticky top-0 flex flex-col">
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Package" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">СкладПро</h1>
                <p className="text-xs text-sidebar-foreground/70">{currentUser?.name}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Дашборд', icon: 'LayoutDashboard' },
              { id: 'products', label: 'Товары', icon: 'Package' },
              { id: 'receipts', label: 'Приёмка', icon: 'ArrowDownToLine' },
              { id: 'shipments', label: 'Отгрузка', icon: 'ArrowUpFromLine' },
              { id: 'warehouse', label: 'Склад', icon: 'Warehouse' },
              { id: 'inventory', label: 'Инвентаризация', icon: 'ClipboardList' },
              { id: 'orders', label: 'Заказы', icon: 'ShoppingCart' },
              { id: 'contractors', label: 'Контрагенты', icon: 'Users' },
              { id: 'reports', label: 'Отчёты', icon: 'BarChart3' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Icon name="User" size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser?.name}</p>
                <Badge variant="outline" className="text-xs">
                  {currentUser?.role === 'buyer' && 'Покупатель'}
                  {currentUser?.role === 'operator' && 'Оператор'}
                  {currentUser?.role === 'supplier' && 'Поставщик'}
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setIsLoggedIn(false)}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Дашборд</h2>
                <p className="text-muted-foreground mt-1">Общая статистика склада</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockData.stats.map((stat, index) => (
                  <Card key={index} className="p-6 hover-scale">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name={stat.icon} size={24} className="text-primary" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Последние заказы</h3>
                  <div className="space-y-3">
                    {mockData.orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{order.number}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                        </div>
                        <Badge>{order.status}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Загрузка склада</h3>
                  <div className="space-y-3">
                    {mockData.warehouse.map((zone, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{zone.zone}</span>
                          <span className="text-muted-foreground">{zone.capacity}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: zone.capacity }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Товары</h2>
                  <p className="text-muted-foreground mt-1">Управление номенклатурой</p>
                </div>
                {canEdit && (
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить товар
                  </Button>
                )}
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Наименование</TableHead>
                      <TableHead>Артикул</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Количество</TableHead>
                      <TableHead>Ячейка</TableHead>
                      {canEdit && <TableHead>Действия</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.location}</Badge>
                        </TableCell>
                        {canEdit && (
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Icon name="Edit" size={16} />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'receipts' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Приёмка</h2>
                  <p className="text-muted-foreground mt-1">Регистрация поступлений</p>
                </div>
                {canEdit && (
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Новая приёмка
                  </Button>
                )}
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер</TableHead>
                      <TableHead>Поставщик</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Позиций</TableHead>
                      <TableHead>Дата</TableHead>
                      {canEdit && <TableHead>Действия</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.receipts.map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell className="font-medium">{receipt.number}</TableCell>
                        <TableCell>{receipt.supplier}</TableCell>
                        <TableCell>
                          <Badge variant={receipt.status === 'Принято' ? 'default' : 'outline'}>
                            {receipt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{receipt.items}</TableCell>
                        <TableCell>{receipt.date}</TableCell>
                        {canEdit && (
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Icon name="Edit" size={16} />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'shipments' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Отгрузка</h2>
                  <p className="text-muted-foreground mt-1">Управление отгрузками</p>
                </div>
                {canEdit && (
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Новая отгрузка
                  </Button>
                )}
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер</TableHead>
                      <TableHead>Клиент</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Позиций</TableHead>
                      <TableHead>Дата</TableHead>
                      {canEdit && <TableHead>Действия</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.shipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.number}</TableCell>
                        <TableCell>{shipment.customer}</TableCell>
                        <TableCell>
                          <Badge>{shipment.status}</Badge>
                        </TableCell>
                        <TableCell>{shipment.items}</TableCell>
                        <TableCell>{shipment.date}</TableCell>
                        {canEdit && (
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Icon name="Edit" size={16} />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'warehouse' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold">Склад</h2>
                <p className="text-muted-foreground mt-1">Структура и загрузка</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockData.warehouse.map((zone, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{zone.zone}</h3>
                        <p className="text-sm text-muted-foreground">{zone.location}</p>
                      </div>
                      <Badge variant="outline">{zone.capacity}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: zone.capacity }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{zone.items} товаров</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Инвентаризация</h2>
                  <p className="text-muted-foreground mt-1">Проверка остатков</p>
                </div>
                {canEdit && (
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Начать инвентаризацию
                  </Button>
                )}
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер</TableHead>
                      <TableHead>Зона</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Прогресс</TableHead>
                      <TableHead>Дата</TableHead>
                      {canEdit && <TableHead>Действия</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.inventory.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.number}</TableCell>
                        <TableCell>{inv.zone}</TableCell>
                        <TableCell>
                          <Badge variant={inv.status === 'Завершена' ? 'default' : 'outline'}>
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${inv.progress}%` }}
                              />
                            </div>
                            <span className="text-sm">{inv.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{inv.date}</TableCell>
                        {canEdit && (
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Icon name="Edit" size={16} />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Заказы</h2>
                  <p className="text-muted-foreground mt-1">Управление заказами</p>
                </div>
                {currentUser?.role === 'buyer' && (
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Новый заказ
                  </Button>
                )}
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер</TableHead>
                      <TableHead>Клиент</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Позиций</TableHead>
                      <TableHead>Дата</TableHead>
                      {canEdit && <TableHead>Действия</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.number}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>
                          <Badge>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        {canEdit && (
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Icon name="Edit" size={16} />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'contractors' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Контрагенты</h2>
                  <p className="text-muted-foreground mt-1">Клиенты и поставщики</p>
                </div>
                {canEdit && (
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить контрагента
                  </Button>
                )}
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Контакт</TableHead>
                      <TableHead>Заказов</TableHead>
                      {canEdit && <TableHead>Действия</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.contractors.map((contractor) => (
                      <TableRow key={contractor.id}>
                        <TableCell className="font-medium">{contractor.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{contractor.type}</Badge>
                        </TableCell>
                        <TableCell>{contractor.contact}</TableCell>
                        <TableCell>{contractor.orders}</TableCell>
                        {canEdit && (
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Icon name="Edit" size={16} />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold">Отчёты</h2>
                <p className="text-muted-foreground mt-1">Аналитика и статистика</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Остатки на складе', icon: 'FileBarChart', description: 'Текущие остатки товаров' },
                  { title: 'Движение товаров', icon: 'TrendingUp', description: 'Приёмка и отгрузка за период' },
                  { title: 'ABC-анализ', icon: 'BarChart3', description: 'Анализ товарооборота' },
                  { title: 'Заполняемость склада', icon: 'PieChart', description: 'Использование площадей' },
                  { title: 'Оборачиваемость', icon: 'ArrowRightLeft', description: 'Скорость оборота товаров' },
                  { title: 'Эффективность', icon: 'Activity', description: 'KPI складских операций' }
                ].map((report, index) => (
                  <Card key={index} className="p-6 cursor-pointer hover-scale">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={report.icon} size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
