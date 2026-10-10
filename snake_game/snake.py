"""一个适合初学者阅读的 pygame 贪吃蛇小游戏。"""

import random

import pygame


# 游戏窗口和网格设置
WIDTH = 600
HEIGHT = 400
CELL_SIZE = 20
FPS = 10

# 颜色（RGB）
BACKGROUND = (30, 30, 30)
SNAKE_COLOR = (50, 200, 80)
HEAD_COLOR = (80, 240, 110)
FOOD_COLOR = (230, 70, 70)
TEXT_COLOR = (255, 255, 255)


def create_food(snake):
    """随机找一个不在蛇身上的格子放食物。"""
    columns = WIDTH // CELL_SIZE
    rows = HEIGHT // CELL_SIZE

    while True:
        food = (
            random.randrange(columns) * CELL_SIZE,
            random.randrange(rows) * CELL_SIZE,
        )
        if food not in snake:
            return food


def reset_game():
    """返回一局新游戏的初始状态。"""
    snake = [(300, 200), (280, 200), (260, 200)]
    direction = (CELL_SIZE, 0)
    food = create_food(snake)
    score = 0
    game_over = False
    return snake, direction, food, score, game_over


def draw_game(screen, font, snake, food, score, game_over):
    """绘制背景、蛇、食物、分数和结束提示。"""
    screen.fill(BACKGROUND)

    # 画蛇头和蛇身
    for index, part in enumerate(snake):
        color = HEAD_COLOR if index == 0 else SNAKE_COLOR
        pygame.draw.rect(screen, color, (*part, CELL_SIZE, CELL_SIZE))

    # 画食物
    pygame.draw.rect(screen, FOOD_COLOR, (*food, CELL_SIZE, CELL_SIZE))

    # 使用英文提示，避免电脑没有中文字体时显示方框
    score_text = font.render(f"Score: {score}", True, TEXT_COLOR)
    screen.blit(score_text, (10, 10))

    if game_over:
        over_text = font.render("Game over! Press R to restart, Esc to quit", True, TEXT_COLOR)
        text_box = over_text.get_rect(center=(WIDTH // 2, HEIGHT // 2))
        screen.blit(over_text, text_box)

    pygame.display.flip()


def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Simple Snake")
    clock = pygame.time.Clock()
    font = pygame.font.SysFont(None, 28)

    snake, direction, food, score, game_over = reset_game()
    next_direction = direction
    running = True

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
                elif game_over and event.key == pygame.K_r:
                    snake, direction, food, score, game_over = reset_game()
                    next_direction = direction
                elif not game_over:
                    # 不允许直接掉头，避免蛇撞到自己的第二节身体
                    if event.key == pygame.K_UP and next_direction != (0, CELL_SIZE):
                        next_direction = (0, -CELL_SIZE)
                    elif event.key == pygame.K_DOWN and next_direction != (0, -CELL_SIZE):
                        next_direction = (0, CELL_SIZE)
                    elif event.key == pygame.K_LEFT and next_direction != (CELL_SIZE, 0):
                        next_direction = (-CELL_SIZE, 0)
                    elif event.key == pygame.K_RIGHT and next_direction != (-CELL_SIZE, 0):
                        next_direction = (CELL_SIZE, 0)

        if not game_over:
            direction = next_direction
            head_x, head_y = snake[0]
            new_head = (head_x + direction[0], head_y + direction[1])

            # 撞墙就结束游戏
            hit_wall = (
                new_head[0] < 0
                or new_head[0] >= WIDTH
                or new_head[1] < 0
                or new_head[1] >= HEIGHT
            )

            ate_food = new_head == food
            if not ate_food:
                # 没吃到食物时，尾巴会先移动，所以允许走到原尾巴的位置
                snake.pop()

            # 撞到自己就结束游戏
            if hit_wall or new_head in snake:
                game_over = True
            else:
                snake.insert(0, new_head)
                if ate_food:
                    score += 1
                    food = create_food(snake)

        draw_game(screen, font, snake, food, score, game_over)
        clock.tick(FPS)

    pygame.quit()


if __name__ == "__main__":
    main()
