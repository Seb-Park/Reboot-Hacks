import pygame
import sys
import time
import main

# Colors
BLACK = (0, 0, 0)
GRAY = (180, 180, 180)
WHITE = (255, 255, 255)

pygame.init()
size = width, height = 1000, 300
resolution = int(1440/2)
screen = pygame.display.set_mode(size)

# Fonts
OPEN_SANS = "assets/fonts/OpenSans-Regular.ttf"
smallFont = pygame.font.Font(OPEN_SANS, 20)
mediumFont = pygame.font.Font(OPEN_SANS, 28)
largeFont = pygame.font.Font(OPEN_SANS, 40)

suggestion_maker = main.SuggestionMaker(main.data)

while True:
    screen.fill(BLACK)
    title = largeFont.render("Focutivity Schedule Suggestions", True, WHITE)
    titleRect = title.get_rect()
    titleRect.center = ((width / 2), 50)
    screen.blit(title, titleRect)

    # rectangles
    Rect = pygame.Rect((width / 2)-(resolution/2), (1 / 4) * height, resolution, 50)
    pygame.draw.rect(screen, WHITE, Rect)

    Rect = pygame.Rect((width / 2)-(resolution/2), (2 / 4) * height, resolution, 50)
    pygame.draw.rect(screen, WHITE, Rect)

    Rect = pygame.Rect((width / 2)-(resolution/2), (3 / 4) * height, resolution, 50)
    pygame.draw.rect(screen, WHITE, Rect)

    # Rect = pygame.Rect((width / 2) - (resolution / 2), (4 / 5) * height, resolution, 50)
    # pygame.draw.rect(screen, WHITE, Rect)

    for item in suggestion_maker.available_times:
        start_x = item[0]/2
        end_x = item[1]/2
        vert_pos = (1 / 4) * height
        r = pygame.Rect(start_x, vert_pos, end_x-start_x, 50)
        pygame.draw.rect(screen, GRAY, r)

        # add title
        title = largeFont.render("Free", True, BLACK)
        titleRect = title.get_rect()
        titleRect.center = (int(start_x+end_x / 4), vert_pos+titleRect.height/2)
        # screen.blit(title, titleRect)

    for item in suggestion_maker.study_effectiveness_data:
        start_x = item.time_block[0]/2
        end_x = item.time_block[1]/2
        vert_pos = (2 / 4) * height
        r = pygame.Rect(start_x, vert_pos, end_x-start_x, 50)
        pygame.draw.rect(screen, GRAY, r)

        # add title
        title = largeFont.render("Free", True, BLACK)
        titleRect = title.get_rect()
        titleRect.center = (int(start_x+end_x / 4), vert_pos+titleRect.height/2)
        # screen.blit(title, titleRect)

    for suggestion in suggestion_maker.best_times():
        start_x = suggestion[0]/2
        end_x = suggestion[1]/2
        value = suggestion_maker.best_times()[suggestion]
        vert_pos = (3 / 4) * height
        r = pygame.Rect(start_x, vert_pos, end_x-start_x, 50)
        pygame.draw.rect(screen, GRAY, r)

        # add title
        title = largeFont.render(str(value), True, BLACK)
        titleRect = title.get_rect()
        titleRect.center = (int(start_x+end_x / 4), vert_pos+titleRect.height/2)
        # screen.blit(title, titleRect)

    # for suggestion in suggestion_maker.best_times():
    #     start_x = suggestion[0]/2
    #     end_x = suggestion[1]/2
    #     value = suggestion_maker.best_times()[suggestion]
    #     vert_pos = (4 / 5) * height
    #     r = pygame.Rect(start_x, vert_pos, end_x-start_x, 50)
    #     pygame.draw.rect(screen, GRAY, r)
    #
    #     # add title
    #     title = largeFont.render(str(value), True, BLACK)
    #     titleRect = title.get_rect()
    #     titleRect.center = (int(start_x+end_x / 5), vert_pos+titleRect.height/2)
    #     # screen.blit(title, titleRect)
    pygame.display.flip()
