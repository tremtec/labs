#! /bin/zsh
session=tt-labs

# kill session
if [ "$1" = "k" ]; then
  echo "Kill session"
  tmux kill-session -t $session
  exit 0
fi

echo "Opening workspace..."

tmux new -s $session -n modmon -c ~/w/tremtec/labs/ -d nvim

# select first window
tmux select-window -t "$session:0"

# attach
echo "attach ? [Y/n]"
read confirm
if [ "${confirm:-y}" = "y" ]; then
  tmux a -t $session
fi

