# Sistema de Design - ESOrbit

## Paleta de Cores

### Cores Principais

- **Azul Primário**: `#2563eb` (blue-600)
- **Índigo Secundário**: `#4f46e5` (indigo-600)
- **Gradiente Principal**: `from-blue-600 to-indigo-600`

### Cores de Estado

- **Sucesso**: `#52c41a` (green)
- **Aviso**: `#faad14` (orange)
- **Erro**: `#ff4d4f` (red)
- **Info**: `#1890ff` (blue)

### Cores de Fundo

- **Gradiente de Fundo**: `from-blue-50 via-white to-indigo-50`
- **Card Background**: `white`
- **Hover Background**: `blue-50`

## Tipografia

### Títulos

- **H1**: `text-6xl md:text-7xl font-extrabold`
- **H2**: `text-5xl font-extrabold`
- **H3**: `text-4xl font-bold`
- **H4**: `text-2xl font-bold`

### Texto

- **Body**: `text-base text-gray-600`
- **Secondary**: `text-sm text-gray-500`
- **Strong**: `font-semibold text-gray-900`

## Componentes

### Cards

```css
className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-2"
```

### Botões

- **Primary**: Gradiente azul-índigo com sombra
- **Secondary**: Borda com hover suave
- **Large**: `h-16 text-lg font-bold px-10`

### Ícones

- Tamanhos: `w-16 h-16` para grandes, `w-12 h-12` para médios
- Background: Gradiente circular com sombra
- Cores: Variam por contexto (azul, índigo, roxo, verde, etc.)

### Badges e Tags

- Bordas arredondadas: `rounded-full` para badges
- Cores contextuais com ícones
- Tamanhos variados: `text-xs` a `text-sm`

## Espaçamento

### Margens e Padding

- **Pequeno**: `p-4` ou `py-2 px-4`
- **Médio**: `p-6` ou `py-4 px-6`
- **Grande**: `p-8` ou `py-6 px-8`

### Gaps

- **Grid**: `gap-4`, `gap-8`, `gap-16`
- **Stack**: `space-y-4`, `space-y-6`, `space-y-8`

## Efeitos e Animações

### Sombras

- **Pequena**: `shadow-sm`
- **Média**: `shadow-lg`
- **Grande**: `shadow-2xl`

### Transições

```css
transition-all duration-300
transform hover:-translate-y-2
hover:shadow-2xl
```

### Gradientes

- **Linear**: `bg-linear-to-br`, `bg-linear-to-r`
- **Direções**: `from-{color} via-{color} to-{color}`

## Bordas

### Raios

- **Pequeno**: `rounded-lg` (8px)
- **Médio**: `rounded-xl` (12px)
- **Grande**: `rounded-2xl` (16px)
- **Extra Grande**: `rounded-3xl` (24px)

### Espessuras

- **Fina**: `border` (1px)
- **Média**: `border-2` (2px)
- **Grossa**: `border-4` (4px)

## Layout

### Container

```css
maxWidth: 1400px
margin: 0 auto
padding: 24px
```

### Grid

- **Responsivo**: `xs={24} sm={12} md={8} lg={6}`
- **Gutters**: `gutter={[16, 16]}`

## Estados de Carregamento

### Spinner

- Centro da tela com altura mínima
- Texto secundário explicativo
- Fundo com gradiente suave

### Empty State

- Ícone grande e descritivo
- Texto claro e acionável
- Botão de ação primária

## Acessibilidade

- Contraste mínimo de 4.5:1
- Tamanhos de fonte legíveis
- Áreas de clique adequadas (mínimo 44x44px)
- Estados de foco visíveis
- Alt text em todas as imagens
