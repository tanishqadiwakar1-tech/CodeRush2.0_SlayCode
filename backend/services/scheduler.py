from apscheduler.schedulers.background import BackgroundScheduler
import logging

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()

def init_scheduler(app):
    scheduler.start()
    logger.info("Simulation scheduler started.")
