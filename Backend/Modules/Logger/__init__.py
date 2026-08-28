
class Logger:
    def __init__(self, name: str):
        self.name = name

    def fatal(self, message: str):
        print(f"\n👿 -> {message}\n")
    def error(self, message: str):
        print(f"\n❌ -> {message}\n")
    def info(self, message: str):
        print(f"\nℹ️ -> {message}\n")
    def hint(self, message: str):
        print(f"\n💡 -> {message}\n")