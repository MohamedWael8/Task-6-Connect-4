$(document).ready(
    function()
    {
        var model =
        {
            init : function()
            {
                this.board = [];
                this.boardSize = 42;
                this.player = 1;
                this.game = "In-Session";
                this.build();
            },

            build : function()
            {
                for(let i=1; i<7; i++)
                {
                    for(let j=1; j<8; j++)
                    {
                        if(i==6)
                            this.board.push(new cell(i,j,"lightBlue","empty",true));
                        else
                            this.board.push(new cell(i,j,"white","empty",false));
                    }
                }
                console.log(this.board);//should be removed when the task is completed
            }
        }
        
        var view = 
        {
            init : function()
            {
                this.$session = $('.winner');
                this.$player = $('.player');
                this.$rowDiv = $(".row");
                this.cellTemplate = $('script[data-template="cell"]').html();
                this.$rowDiv.on('click', '.circle', function(e) 
                {
                    var row = e.target.attributes.row.value;
                    var column = e.target.attributes.column.value
                    octopus.dropCell(row, column);
                    return false;
                });
                this.render();
            },

            render : function()
            {
                var $rowDiv = this.$rowDiv;
                var $session =  this.$session;
                var $player = this.$player;
                $rowDiv.html('');
                var cellTemplate = this.cellTemplate;
                var cells = octopus.getCells();
                $session.text(octopus.getSession());
                $player.text(octopus.getPlayer());
                cells.forEach(function(cell)
                {
                    var thisTemplate = cellTemplate.replace(/{{row}}/g, cell.row);
                    thisTemplate = thisTemplate.replace(/{{column}}/g, cell.column);
                    thisTemplate = thisTemplate.replace(/{{color}}/g, cell.color);
                    $rowDiv.append(thisTemplate);
                });
            }
        }

        var octopus =
        {
            init : function()
            {
                model.init();
                view.init();
            },

            dropCell : function(row,column)
            {
                if(model.game == "In-Session")
                {
                    var currentCell =  model.board.find(cell => (cell.row == row && cell.column == column));
                    if(currentCell.status != "filled" && currentCell.available)
                    {
                        currentCell.status = "filled"
                        octopus.setAvailability(currentCell.id-1);
                        if(model.player == 1)
                        {
                            currentCell.color = "red";
                            this.connectFour(currentCell.id-1, currentCell.color)
                        }
                        else
                        {
                            currentCell.color = "yellow";
                            this.connectFour(currentCell.id-1, currentCell.color)
                        }
                        this.changePlayer();
                        view.render();
                    }
                    
                }
                
                
            },

            getCells : function()
            {
                var cells = model.board;
                return cells;
            },

            changePlayer : function ()
            {
                if(model.player == 1)
                    model.player = 2;
                else
                    model.player = 1;
            },

            setAvailability : function (position)
            {
                model.board[position].available = false;
                if(position-7 > 0)
                {
                    model.board[position-7].available = true;
                    model.board[position-7].color = "lightBlue";
                }
            },

            getSession : function()
            {
                return model.game;
            },

            getPlayer :function()
            {
                if(model.player == 1)
                    return "Player One";
                else
                    return "Player Two";
            },

            connectFour : function (position,color)
            {
                if(this.horizontalConnection(position,color))
                {
                    console.log(color + " is the winner");
                    model.game = "Ended: " + color + " is the winner";
                    view.render();
                    return;
                }
                if(this.verticalConnection(position,color))
                {
                    console.log(color + " is the winner");
                    model.game = "Ended: " + color + " is the winner";
                    view.render();
                    return;
                }
                if(this.topLeftDiagonalConnection(position,color))
                {
                    console.log(color + " is the winner");
                    model.game = "Ended: " + color + " is the winner";
                    view.render();
                    return;
                }
                if(this.topRightDiagonalConnection(position,color))
                {
                    console.log(color + " is the winner");
                    model.game = "Ended: " + color + " is the winner";
                    view.render();
                    return;
                }
                if(this.diagonalVConnection(position,color))
                {
                    console.log(color + " is the winner");
                    model.game = "Ended: " + color + " is the winner";
                    view.render();
                    return;
                }
                if(this.diagonalEightConnection(position,color))
                {
                    console.log(color + " is the winner");
                    model.game = "Ended: " + color + " is the winner";
                    view.render();
                    return;
                }
            },

            horizontalConnection : function(position,color)
            {
                var horizontalCounter=0;
                var i=0;
                if(position+(i)<=model.boardSize-1) 
                {
                    if(model.board[position+(i)].row == model.board[position].row)
                    {
                        while(position+(i)<=model.boardSize-1 && model.board[position+i].color == color)
                        {
                            horizontalCounter++;
                            i++;
                        }
                    }   
                }
                i=1;
                if(position-(i)>=0)
                {
                    if(model.board[position-(i)].row == model.board[position].row)
                    {
                        while(position-(i)>=0 && model.board[position-i].color == color)
                        {
                            horizontalCounter++;
                            i++;
                        }
                    }
                }
                if(horizontalCounter == 4)
                    return true;
                else
                    return false;
            },

            verticalConnection : function(position,color)
            {
                var verticalCounter=0;
                var i=0;
                if(position+(i*7) <= model.boardSize-1)
                {
                    if(model.board[position+(i*7)].column == model.board[position].column)
                    {
                        while(position+(i*7) <= model.boardSize-1 && model.board[position+(i*7)].color == color)
                        {
                            verticalCounter++;
                            i++;
                        }
                    }
                }
                i=1;
                if(position-(i*7) >= 0)
                {
                    if(position-(i*7) >= 0 && model.board[position-(i*7)].column == model.board[position].column)
                    {
                        while(model.board[position-(i*7)].color == color)
                        {
                            verticalCounter++;
                            i++;
                        }
                    }
                } 
                if(verticalCounter == 4)
                    return true;
                else
                    return false;
            },

            topLeftDiagonalConnection : function(position,color)
            {
                var diagonalLeftTop = 1;
                var i=1;
                if((position+(i*7))+i <= model.boardSize-1)
                {
                    while((position+(i*7))+i <= model.boardSize-1 && model.board[position+(i*7)+i].color == color)
                    {
                        diagonalLeftTop++;
                        i++;
                    }
                }
                i=1;
                if((position-(i*7))-i >= 0)
                {
                    while(model.board[(position-(i*7))-i].color == color)
                    {
                        diagonalLeftTop++;
                        i++;
                    }
                }
                if(diagonalLeftTop == 4)
                    return true;
                else
                    return false;
            },

            topRightDiagonalConnection : function(position,color)
            {
                var diagonalTopRight = 1;
                var i=1;
                if((position+(i*7))-i <= model.boardSize-1)
                {
                    while((position+(i*7))-i <= model.boardSize-1 && model.board[(position+(i*7))-i].color == color)
                    {
                        diagonalTopRight++;
                        i++;
                    }
                }
                i=1;
                if((position-(i*7))+i >= 0)
                {
                    while(model.board[(position-(i*7))+i].color == color)
                    {
                        diagonalTopRight++;
                        i++;
                    }
                }
                if(diagonalTopRight == 4)
                    return true;
                else
                    return false;
            },

            rightDiagonalUp : function(position,color)
            {
                if((position-(7))+1 >= 0)
                {
                    if(model.board[(position-(7))+1].color == color)
                    {
                        if((position-(14))+2 >= 0)
                        {
                            console.log(model.board[(position-(14))+2].color +" "+ color)
                            if(model.board[(position-(14))+2].color == color)
                            {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },

            rightDiagonalDown : function(position,color)
            {
                if((position+(7))-1 < 42)
                {
                    if(model.board[(position+(7))-1].color == color)
                    {
                        if((position+(14))-2 < 42)
                        {
                            if(model.board[(position+(14))-2].color == color)
                            {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },

            leftDiagonalUp : function(position,color)
            {
                if((position-(7))-1 >= 0)
                {
                    if(model.board[(position-(7))-1].color == color)
                    {
                        if((position-(14))-2 >= 0)
                        {
                            if(model.board[(position-(14))-2].color == color)
                            {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },

            leftDiagonalDown : function(position,color)
            {
                if((position+(7))+1 < 42)
                {
                    if(model.board[(position+(7))+1].color == color)
                    {
                        if((position+(14))+2 < 42)
                        {
                            if(model.board[(position+(14))+2].color == color)
                            {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },

            diagonalVConnection : function(position,color)
            {
                if(this.rightDiagonalUp(position,color))
                {
                    console.log("RightUp true")
                    if(this.leftDiagonalUp(position,color))
                    {
                        console.log("LeftUp true")
                        return true;
                    }
                }

                if(this.rightDiagonalDown(position,color))
                {
                    console.log("RightDown true")
                    if(this.leftDiagonalUp((position+14)-2) , color)
                    {
                        console.log("LeftUp true")
                        return true
                    }
                }

                if(this.leftDiagonalDown(position,color))
                {
                    console.log("LeftDown true")
                    if(this.rightDiagonalUp((position+14)+2,color))
                    {
                        console.log("RightUp true ")
                        return true
                    }
                }
            },

            diagonalEightConnection : function(position,color)
            {
                if(this.rightDiagonalUp(position,color))
                {
                    console.log("RightUp true")
                    if(this.leftDiagonalDown((position-14)+2,color))
                    {
                        console.log("LeftDown true")
                        return true;
                    }
                }

                if(this.leftDiagonalDown(position,color))
                {
                    console.log("LeftDown true")
                    if(this.rightDiagonalDown(position , color))
                    {
                        console.log("RightDown true")
                        return true
                    }
                }

                if(this.leftDiagonalUp(position,color))
                {
                    console.log("LeftUp true")
                    if(this.rightDiagonalDown((position-14)-2,color))
                    {
                        console.log("RightDown true ")
                        return true
                    }
                }
            }


        }
        octopus.init();
    }
)

function cell(row,column,color,status,available)
{
    this.id = column+(7 * (row-1));
    this.row = row;
    this.column = column;
    this.color = color;
    this.status = status;
    this.available = available;
}